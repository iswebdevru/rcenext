import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Children,
  ComponentPropsWithRef,
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { classNameWithDefaults, clsx, russianEnding } from '../lib/ui';
import { Button } from './Button';
import { InputSearch } from './Input';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { wait } from '../lib/time';
import { useNotificationEmitter } from './Notification';

/**
 * TODO: save();
 *
 */

export type Id = string | number;

export type TableCreatorComponentProps = {
  refresh: AsyncAction;
};

export type TableUpdaterComponentProps<T> = {
  id: T;
} & TableCreatorComponentProps;

type AsyncAction = () => Promise<unknown> | unknown;

type ExistingItem = {
  state: 'show' | 'edit' | 'hide' | 'idle';
  isSelected: boolean;
};

type NewItem = {
  id: string;
  state: 'show' | 'hide';
};

type TableRowContextExisting = {
  kind: 'existing';
  state: 'show' | 'edit' | 'hide' | 'idle';
  isSelected: boolean;
  toggleSelect: () => void;
  markEdited: () => void;
  toReadOnlyView: () => void;
};
type TableRowContextNew = {
  kind: 'new';
  state: 'show' | 'hide';
  close: () => Promise<void>;
};

const TableRowContext = createContext<
  TableRowContextExisting | TableRowContextNew | undefined
>(undefined);

type TableContext<T extends Id> = {
  displayedItems: T[];
  setDisplayedItems: Dispatch<SetStateAction<T[]>>;
  existingItems: Map<T, ExistingItem>;
  setExistingItems: Dispatch<SetStateAction<Map<T, ExistingItem>>>;
  newItems: NewItem[];
  setNewItems: Dispatch<SetStateAction<NewItem[]>>;
};

const TableContext = createContext<TableContext<any>>(undefined as any);

const TTD = 200;

export function Table<T extends Id>({ children }: PropsWithChildren) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [existingItems, setExistingItems] = useState<Map<T, ExistingItem>>(
    new Map()
  );
  const [newItems, setNewItems] = useState<NewItem[]>([]);

  return (
    <TableContext.Provider
      value={{
        displayedItems,
        setDisplayedItems,
        existingItems,
        setExistingItems,
        newItems,
        setNewItems,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export type TableHeaderProps<T extends Id> = {
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
  search: string;
  onSearchChange: (search: string) => void;
};

Table.ControlPanel = function TableControlPanel<T extends Id>({
  onDelete,
  onSearchChange,
  search,
}: TableHeaderProps<T>) {
  const notify = useNotificationEmitter();
  const [isDisabled, setIsDisabled] = useState(false);
  const { displayedItems, setNewItems, existingItems, setExistingItems } =
    useContext<TableContext<T>>(TableContext);

  const itemsToDelete = displayedItems.filter(
    id => existingItems.get(id)?.isSelected
  );

  const handleDelete = async () => {
    setIsDisabled(true);
    setExistingItems(prev => {
      const updated = new Map(prev);
      itemsToDelete.forEach(id => {
        updated.set(id, { ...updated.get(id)!, state: 'hide' });
      });
      return updated;
    });
    await wait(TTD);
    try {
      await onDelete(itemsToDelete);
      notify({
        kind: 'success',
        text: `Удалено: ${itemsToDelete.length} запис${russianEnding(
          itemsToDelete.length,
          ['ь', 'и', 'ей']
        )}`,
      });
      setExistingItems(prev => {
        const updated = new Map(prev);
        itemsToDelete.forEach(id => updated.delete(id));
        return updated;
      });
    } catch (e) {
      setExistingItems(prev => {
        const updated = new Map(prev);
        itemsToDelete.forEach(id => {
          updated.set(id, { ...updated.get(id)!, state: 'show' });
        });
        return updated;
      });
      notify({
        kind: 'error',
        text: `Ошибка: не удалось выполнить удаление ${
          itemsToDelete.length
        } запис${russianEnding(itemsToDelete.length, ['и', 'ей', 'ей'])}`,
      });
    }
    setIsDisabled(false);
  };

  const handleAdd = () =>
    setNewItems(prev => [{ id: uuid(), state: 'show' }, ...prev]);

  return (
    <div className="mb-4 flex gap-4">
      <InputSearch
        onChange={e => onSearchChange(e.currentTarget.value)}
        value={search}
      />
      <Button
        type="button"
        variant="danger-outline"
        disabled={!itemsToDelete.length || isDisabled}
        className="ml-auto"
        onClick={handleDelete}
      >
        Удалить
      </Button>
      <Button type="button" variant="primary" onClick={handleAdd}>
        Добавить
      </Button>
    </div>
  );
};

export type TableBodyProps<T extends Id> = {
  children?:
    | ReactElement<TableRowProps<T>>
    | ReactElement<TableRowProps<any>>[];
  header: ReactNode;
  updater: (id: T) => ReactElement;
  creator: () => ReactElement;
};

Table.Body = function TableBody<T extends Id>({
  children,
  updater,
  creator,
  header,
}: TableBodyProps<T>) {
  const {
    setDisplayedItems,
    existingItems,
    setExistingItems,
    newItems,
    setNewItems,
  } = useContext(TableContext);

  useEffect(() => {
    setDisplayedItems(() => {
      if (!children) {
        return [];
      }
      return Children.map(children, child => child.props.rowId);
    });
  }, [children, setDisplayedItems]);

  return (
    <div>
      <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <table className="w-full table-fixed">
          <tbody>
            {header}
            {newItems.map(item => (
              <TableRowContext.Provider
                key={item.id}
                value={{
                  kind: 'new',
                  state: item.state,
                  close: async () => {
                    setNewItems(p =>
                      p.map(v => {
                        if (v.id !== item.id) {
                          return v;
                        }
                        return { ...v, state: 'hide' };
                      })
                    );
                    await wait(TTD);
                    setNewItems(p => p.filter(v => v.id !== item.id));
                  },
                }}
              >
                {creator()}
              </TableRowContext.Provider>
            ))}
            {children
              ? Children.map(children, child => {
                  const itemData = existingItems.get(child.props.rowId);
                  return (
                    <TableRowContext.Provider
                      key={child.props.rowId}
                      value={{
                        kind: 'existing',
                        state: itemData?.state ?? 'show',
                        isSelected: itemData?.isSelected ?? false,
                        toggleSelect: () =>
                          setExistingItems(prev => {
                            const updated = new Map(prev);
                            const itemPrevData = updated.get(child.props.rowId);
                            updated.set(child.props.rowId, {
                              state: 'show',
                              ...itemPrevData,
                              isSelected: itemPrevData
                                ? !itemPrevData.isSelected
                                : true,
                            });
                            return updated;
                          }),
                        markEdited: () =>
                          setExistingItems(prev => {
                            const updated = new Map(prev);
                            const itemPrevData = updated.get(child.props.rowId);
                            updated.set(child.props.rowId, {
                              isSelected: false,
                              ...itemPrevData,
                              state: 'edit',
                            });
                            return updated;
                          }),
                        toReadOnlyView: () =>
                          setExistingItems(prev => {
                            const updated = new Map(prev);
                            const itemPrevData = updated.get(child.props.rowId);
                            updated.set(child.props.rowId, {
                              isSelected: false,
                              ...itemPrevData,
                              state: 'idle',
                            });
                            return updated;
                          }),
                      }}
                    >
                      {itemData?.state === 'edit'
                        ? updater(child.props.rowId)
                        : child}
                    </TableRowContext.Provider>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.SelectRowCheckbox = function TableSelectRowCheckbox() {
  const { isSelected, toggleSelect } = useContext(
    TableRowContext
  ) as TableRowContextExisting;
  return <input type="checkbox" checked={isSelected} onChange={toggleSelect} />;
};

Table.ButtonEdit = function TableButtonEdit() {
  const { markEdited } = useContext(TableRowContext) as TableRowContextExisting;
  return (
    <button className="group/edit-btn p-1" onClick={markEdited}>
      <FontAwesomeIcon
        icon={faPenToSquare}
        fixedWidth
        className="text-lg text-blue-500 transition-colors group-hover/edit-btn:scale-110 group-hover/edit-btn:text-blue-900"
      />
    </button>
  );
};

Table.SelectAllRowsCheckbox = function TableSelectAllRowsCheckbox() {
  const { displayedItems, existingItems, setExistingItems } =
    useContext(TableContext);

  const allVisibleItemsSelected =
    !!displayedItems.length &&
    displayedItems.every(id => existingItems.get(id)?.isSelected);

  return (
    <input
      type="checkbox"
      checked={allVisibleItemsSelected}
      onChange={() => {
        setExistingItems(prev => {
          const updated = new Map(prev);
          if (allVisibleItemsSelected) {
            displayedItems.forEach(id => {
              updated.set(id, {
                state: 'show',
                ...prev.get(id),
                isSelected: false,
              });
            });
          } else {
            displayedItems.forEach(id => {
              updated.set(id, {
                state: 'show',
                ...prev.get(id),
                isSelected: true,
              });
            });
          }
          return updated;
        });
      }}
    />
  );
};

Table.ButtonCancel = function TableButtonCancel() {
  const ctx = useContext(TableRowContext)!;
  if (ctx.kind === 'existing') {
    return (
      <button
        className="group/editor-cancel flex items-center justify-center p-1"
        onClick={ctx?.toReadOnlyView}
      >
        <FontAwesomeIcon
          icon={faRotateBack}
          fixedWidth
          className="text-lg text-neutral-600 group-hover/editor-cancel:scale-110 group-hover/editor-cancel:text-yellow-500"
        />
      </button>
    );
  }
  return (
    <button
      className="group/editor-del flex shrink-0 items-center justify-center p-1"
      onClick={ctx?.close}
    >
      <FontAwesomeIcon
        icon={faXmark}
        fixedWidth
        className="text-lg text-neutral-600 group-hover/editor-del:scale-110 group-hover/editor-del:text-red-500"
      />
    </button>
  );
};

export type TableButtonCreateProps = {
  onSave: AsyncAction;
  refresh: AsyncAction;
};

Table.ButtonCreate = function TableButtonCreate({
  onSave,
  refresh,
}: TableButtonCreateProps) {
  const notify = useNotificationEmitter();
  const ctx = useContext(TableRowContext) as TableRowContextNew;

  const handleCreate = async () => {
    try {
      await Promise.all([onSave(), ctx.close()]);
      notify({
        kind: 'success',
        text: 'Запись успешно создана',
      });
      refresh();
    } catch (e) {
      notify({
        kind: 'error',
        text: `Ошибка: не удалось сохранить запись`,
      });
    }
  };

  return (
    <button
      className="group/editor-save flex shrink-0 items-center justify-center p-1"
      onClick={handleCreate}
    >
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        className="text-lg text-neutral-600 group-hover/editor-save:scale-110 group-hover/editor-save:text-green-500"
      ></FontAwesomeIcon>
    </button>
  );
};

export type TableButtonUpdateProps = TableButtonCreateProps;

Table.ButtonUpdate = function TableButtonUpdate({
  onSave,
  refresh,
}: TableButtonUpdateProps) {
  const notify = useNotificationEmitter();
  const ctx = useContext(TableRowContext) as TableRowContextExisting;

  const handleUpdate = async () => {
    try {
      await onSave();
      notify({
        kind: 'success',
        text: 'Запись успешно обновлена',
      });
    } catch (e) {
      notify({
        kind: 'error',
        text: `Ошибка: не удалось обновить запись`,
      });
    }
    ctx.toReadOnlyView();
  };

  return (
    <button
      className="group/editor-save flex shrink-0 items-center justify-center p-1"
      onClick={handleUpdate}
    >
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        className="text-lg text-neutral-600 group-hover/editor-save:scale-110 group-hover/editor-save:text-green-500"
      ></FontAwesomeIcon>
    </button>
  );
};

export type TableRowProps<T extends Id = Id> = {
  rowId?: T;
} & ComponentPropsWithRef<'tr'>;

Table.Row = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, rowId, ...props },
  ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      className={classNameWithDefaults(
        clsx({
          'group/row rounded-md border-b border-zinc-200 transition-[background] last:border-b-0 dark:border-zinc-700':
            true,
        }),
        className
      )}
    />
  );
});

Table.DataLoader = function TableDataPlaceholder() {
  return (
    <Table.Data>
      <div className="h-8 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </Table.Data>
  );
};

Table.Data = forwardRef<HTMLTableCellElement, ComponentPropsWithRef<'td'>>(
  function TableData({ className, children, ...props }, ref) {
    const ctx = useContext(TableRowContext);

    return (
      <td
        className={classNameWithDefaults(
          clsx({
            'p-0 text-sm text-black group-last/row:first:rounded-bl-md group-last:last:rounded-br-md dark:text-zinc-200':
              true,
            'bg-zinc-50 dark:bg-zinc-700':
              ctx?.kind === 'existing' && ctx.isSelected,
            'animate-table-data-blink-light dark:animate-table-data-blink-dark':
              ctx?.state === 'edit' || ctx?.state === 'idle',
          }),
          className
        )}
        {...props}
      >
        <div
          className={clsx({
            'flex items-center px-6': true,
            'py-3': !ctx,
            'animate-table-data-show': ctx?.state === 'show',
            'animate-table-data-hide': ctx?.state === 'hide',
            'max-h-12 px-6 py-3':
              ctx?.state === 'edit' || ctx?.state === 'idle',
          })}
        >
          {children}
        </div>
      </td>
    );
  }
);

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return (
    <th className="text-left text-sm font-semibold text-slate-900 first:w-[61px] last:w-[114px] dark:text-slate-100">
      <div className="flex h-12 items-center px-6 py-3">{children}</div>
    </th>
  );
};

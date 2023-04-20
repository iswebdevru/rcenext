import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEventHandler,
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
import { classNameWithDefaults, clsx } from '../lib/ui';
import { Button } from './Button';
import { InputSearch } from './Input';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { wait } from '../lib/time';

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

type ExistingItem<T extends Id> = {
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
  cancel: () => void;
};
type TableRowContextNew = {
  kind: 'new';
  state: 'show' | 'hide';
  cancel: () => Promise<void>;
  save: () => void;
};

const TableRowContext = createContext<
  TableRowContextExisting | TableRowContextNew | undefined
>(undefined);

type TableContext<T extends Id> = {
  displayedItems: T[];
  setDisplayedItems: Dispatch<SetStateAction<T[]>>;
  existingItems: Map<T, ExistingItem<T>>;
  setExistingItems: Dispatch<SetStateAction<Map<T, ExistingItem<T>>>>;
  newItems: NewItem[];
  setNewItems: Dispatch<SetStateAction<NewItem[]>>;
};

const TableContext = createContext<TableContext<any>>(undefined as any);

const TTD = 200;

export function Table<T extends Id>({ children }: PropsWithChildren) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [existingItems, setExistingItems] = useState<Map<T, ExistingItem<T>>>(
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
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
};

Table.Header = function TableHeader<T extends Id>({
  onDelete,
  onSearchChange,
}: TableHeaderProps<T>) {
  const { displayedItems, setNewItems, existingItems, setExistingItems } =
    useContext<TableContext<T>>(TableContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const itemsToDelete = displayedItems.filter(
    id => existingItems.get(id)?.isSelected
  );

  return (
    <div className="flex gap-4 mb-4">
      <InputSearch
        onChange={e => {
          if (onSearchChange) {
            onSearchChange(e);
          }
        }}
      />
      <Button
        type="button"
        variant="danger-outline"
        disabled={!itemsToDelete.length || isDisabled}
        className="ml-auto"
        onClick={async () => {
          setIsDisabled(true);
          setExistingItems(prev => {
            const updated = new Map(prev);
            itemsToDelete.forEach(id => {
              updated.set(id, { ...updated.get(id)!, state: 'hide' });
            });
            return updated;
          });
          await wait(TTD);
          await onDelete(itemsToDelete);
          setExistingItems(prev => {
            const updated = new Map(prev);
            itemsToDelete.forEach(updated.delete);
            return updated;
          });
          setIsDisabled(false);
        }}
      >
        Удалить
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() =>
          setNewItems(prev => [{ id: uuid(), state: 'show' }, ...prev])
        }
      >
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
      <div className="bg-white border rounded-md border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full table-fixed">
          <tbody>
            {header}
            {newItems.map(item => (
              <TableRowContext.Provider
                key={item.id}
                value={{
                  kind: 'new',
                  state: item.state,
                  cancel: async () => {
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
                  save: () => {},
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
                        cancel: () =>
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
  return (
    <Table.Data>
      <input type="checkbox" checked={isSelected} onChange={toggleSelect} />
    </Table.Data>
  );
};

Table.EditRowButton = function TableEditRowButton() {
  const { markEdited } = useContext(TableRowContext) as TableRowContextExisting;
  return (
    <Table.Data>
      <button className="p-1 group/edit-btn" onClick={markEdited}>
        <FontAwesomeIcon
          icon={faPenToSquare}
          fixedWidth
          className="text-lg text-blue-500 transition-colors group-hover/edit-btn:text-blue-900 group-hover/edit-btn:scale-110"
        />
      </button>
    </Table.Data>
  );
};

Table.SelectAllRowsCheckbox = function TableSelectAllRowsCheckbox() {
  const { displayedItems, existingItems, setExistingItems } =
    useContext(TableContext);

  const allVisibleItemsSelected =
    !!displayedItems.length &&
    displayedItems.every(id => existingItems.get(id)?.isSelected);

  return (
    <Table.Head>
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
    </Table.Head>
  );
};

export type TableRowEditorActionsProps = {
  onSave: AsyncAction;
};

Table.EditorActions = function TableRowEditorActions({
  onSave,
}: TableRowEditorActionsProps) {
  const ctx = useContext(TableRowContext);
  return (
    <Table.Data>
      <button
        className="flex items-center justify-center p-1 group/editor-save shrink-0"
        onClick={async () => {
          await onSave();
          ctx?.cancel();
        }}
      >
        <FontAwesomeIcon
          icon={faCheck}
          fixedWidth
          className="text-lg text-neutral-600 group-hover/editor-save:text-green-500 group-hover/editor-save:scale-110"
        ></FontAwesomeIcon>
      </button>
      {ctx?.kind === 'existing' ? (
        <button
          className="flex items-center justify-center p-1 group/editor-cancel"
          onClick={ctx?.cancel}
        >
          <FontAwesomeIcon
            icon={faRotateBack}
            fixedWidth
            className="text-lg text-neutral-600 group-hover/editor-cancel:text-yellow-500 group-hover/editor-cancel:scale-110"
          />
        </button>
      ) : (
        <button
          className="flex items-center justify-center p-1 group/editor-del shrink-0"
          onClick={ctx?.cancel}
        >
          <FontAwesomeIcon
            icon={faXmark}
            fixedWidth
            className="text-lg text-neutral-600 group-hover/editor-del:text-red-500 group-hover/editor-del:scale-110"
          />
        </button>
      )}
    </Table.Data>
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
          'border-b border-slate-200 dark:border-slate-700 group/row last:border-b-0 rounded-md transition-[background]':
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
      <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
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
            'text-black dark:text-slate-200 text-sm group-last/row:first:rounded-bl-md group-last:last:rounded-br-md p-0':
              true,
            'bg-slate-100 dark:bg-slate-700':
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
            'flex items-center px-6 overflow-x-auto overflow-y-hidden': true,
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
    <th className="text-sm text-left first:w-[61px] last:w-[114px] text-slate-900 dark:text-slate-100 font-semibold">
      <div className="flex items-center h-12 px-6 py-3">{children}</div>
    </th>
  );
};

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
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { compareArrays } from '../lib/common';
import { classNameWithDefaults, clsx } from '../lib/ui';
import { Button } from './Button';
import { InputSearch } from './Input';

export type Id = string | number;

export type TableProps<T extends Id> = {
  header: ReactNode;
  loader: ReactNode;
  children?:
    | ReactElement<TableRowWithIdProps<T>>
    | ReactElement<TableRowWithIdProps<T>>[]
    | null;
  updater: (id: T) => ReactElement;
  creator: () => ReactElement;
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
};

export type TableCreatorComponentProps = {
  refresh: AsyncAction;
};

export type TableUpdaterComponentProps<T> = {
  id: T;
} & TableCreatorComponentProps;

type AsyncAction = () => Promise<unknown> | unknown;

type ItemsMapValue = { isEditing?: boolean; isSelected?: boolean };
type ItemsMap<K extends Id> = Map<K, ItemsMapValue>;

type TableRowEditorContext = {
  close: () => void;
  isExisting: boolean;
};

const TableRowEditorContext = createContext<TableRowEditorContext>(
  undefined as any
);

type TableHeaderContext = {
  areAllItemsSelected: boolean;
  selectAllItems: () => void;
  deselectAllItems: () => void;
};

type TableRowWithIdContext = {
  isSelected: boolean;
  toggle: () => void;
  markEdited: () => void;
};

const TableHeaderContext = createContext<TableHeaderContext>(undefined as any);
const TableRowWithIdContext = createContext<TableRowWithIdContext>(
  undefined as any
);

export function Table<T extends Id>({
  children,
  header,
  loader,
  updater,
  creator,
  onDelete,
  onSearchChange,
}: TableProps<T>) {
  const allItems = useMemo(
    () => (children ? Children.map(children, child => child.props.id) : []),
    [children]
  );
  const [itemsMap, setItemsMap] = useState<ItemsMap<T>>(new Map());
  const [newItems, setNewItems] = useState<number[]>([]);

  const updateItemById = useCallback((id: T, data: ItemsMapValue) => {
    setItemsMap(prev => {
      const prevValue = prev.get(id);
      return new Map(
        prev.set(id, prevValue ? { ...prevValue, ...data } : data)
      );
    });
  }, []);
  const updateManyItems = useCallback((data: ItemsMapValue) => {
    setItemsMap(prev => {
      [...prev.keys()].map(id => {
        const prevValue = prev.get(id);
        prev.set(id, prevValue ? { ...prevValue, ...data } : data);
      });
      return new Map(prev);
    });
  }, []);
  const selectAllItems = useCallback(() => {
    setItemsMap(prev => {
      allItems.forEach(id => {
        const prevValue = prev.get(id);
        const newValue = { isSelected: true };
        prev.set(id, prevValue ? { ...prevValue, ...newValue } : newValue);
      });
      return new Map(prev);
    });
  }, [allItems]);
  const deselectAllItems = useCallback(
    () => updateManyItems({ isSelected: false }),
    [updateManyItems]
  );

  const selectedItems = [...itemsMap.entries()]
    .filter(([_, info]) => info.isSelected)
    .map(([id]) => id);

  const areAllItemsSelected =
    selectedItems.length !== 0 && compareArrays(selectedItems, allItems);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <InputSearch onChange={onSearchChange} />
        <Button
          type="button"
          variant="danger-outline"
          disabled={!selectedItems.length}
          className="ml-auto"
          onClick={async () => {
            await onDelete(selectedItems);
            deselectAllItems();
          }}
        >
          Удалить
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => setNewItems(p => [Date.now(), ...p])}
        >
          Добавить
        </Button>
      </div>
      <div className="bg-white border rounded-md border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full table-fixed">
          <tbody>
            <TableHeaderContext.Provider
              value={{ areAllItemsSelected, selectAllItems, deselectAllItems }}
            >
              {header}
            </TableHeaderContext.Provider>
            <>
              {newItems.map(id => (
                <TableRowEditorContext.Provider
                  key={id}
                  value={{
                    close: () => setNewItems(p => p.filter(v => v !== id)),
                    isExisting: false,
                  }}
                >
                  {creator()}
                </TableRowEditorContext.Provider>
              ))}
            </>
            <>
              {children
                ? Children.map(children, child => {
                    const rowInfo = itemsMap.get(child.props.id);
                    if (rowInfo?.isEditing) {
                      return (
                        <TableRowEditorContext.Provider
                          value={{
                            close: () =>
                              updateItemById(child.props.id, {
                                isEditing: false,
                              }),
                            isExisting: true,
                          }}
                        >
                          {updater(child.props.id)}
                        </TableRowEditorContext.Provider>
                      );
                    }
                    return (
                      <TableRowWithIdContext.Provider
                        value={{
                          isSelected: !!rowInfo?.isSelected,
                          toggle: () =>
                            updateItemById(child.props.id, {
                              isSelected: !rowInfo?.isSelected,
                            }),
                          markEdited: () =>
                            updateItemById(child.props.id, {
                              isEditing: true,
                            }),
                        }}
                      >
                        {child}
                      </TableRowWithIdContext.Provider>
                    );
                  })
                : loader}
            </>
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.SelectRowCheckbox = function TableSelectRowCheckbox() {
  const { isSelected, toggle } = useContext(TableRowWithIdContext);
  return (
    <Table.Data>
      <input type="checkbox" checked={isSelected} onChange={toggle} />
    </Table.Data>
  );
};

Table.EditRowButton = function TableEditRowButton() {
  const { markEdited } = useContext(TableRowWithIdContext);
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
  const { areAllItemsSelected, selectAllItems, deselectAllItems } =
    useContext(TableHeaderContext);

  return (
    <Table.Head>
      <input
        type="checkbox"
        checked={areAllItemsSelected}
        onChange={() => {
          if (areAllItemsSelected) {
            return deselectAllItems();
          }
          selectAllItems();
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
  const { close, isExisting } = useContext(TableRowEditorContext);
  return (
    <Table.Data>
      <button
        className="flex items-center justify-center p-1 m-1 group/editor-save shrink-0"
        onClick={async () => {
          await onSave();
          close();
        }}
      >
        <FontAwesomeIcon
          icon={faCheck}
          fixedWidth
          className="text-xl text-neutral-600 group-hover/editor-save:text-green-500 group-hover/editor-save:scale-110"
        ></FontAwesomeIcon>
      </button>
      {isExisting ? (
        <button
          className="flex items-center justify-center p-1 group/editor-cancel"
          onClick={close}
        >
          <FontAwesomeIcon
            icon={faRotateBack}
            fixedWidth
            className="text-xl text-neutral-600 group-hover/editor-cancel:text-yellow-500 group-hover/editor-cancel:scale-110"
          />
        </button>
      ) : (
        <button
          className="flex items-center justify-center p-1 group/editor-del shrink-0"
          onClick={close}
        >
          <FontAwesomeIcon
            icon={faXmark}
            fixedWidth
            className="text-xl text-neutral-600 group-hover/editor-del:text-red-500 group-hover/editor-del:scale-110"
          />
        </button>
      )}
    </Table.Data>
  );
};

export type TableRowWithIdProps<T = Id> = {
  id: T;
  children?: ReactNode;
};

Table.RowWithId = forwardRef<HTMLTableRowElement, TableRowWithIdProps>(
  function TableRowWithId({ children }, ref) {
    const { isSelected } = useContext(TableRowWithIdContext);
    return (
      <Table.Row
        className={clsx({
          '[&>td]:bg-slate-100 dark:[&>td]:bg-slate-700': isSelected,
        })}
        ref={ref}
      >
        {children}
      </Table.Row>
    );
  }
);

Table.Row = forwardRef<HTMLTableRowElement, ComponentPropsWithRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        {...props}
        ref={ref}
        className={classNameWithDefaults(
          'border-b border-slate-200 dark:border-slate-700 group/row last:border-b-0 rounded-md transition-[background]',
          className
        )}
      />
    );
  }
);

Table.DataLoader = function TableDataPlaceholder() {
  return (
    <Table.Data>
      <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
    </Table.Data>
  );
};

Table.Data = forwardRef<HTMLTableCellElement, ComponentPropsWithRef<'td'>>(
  function TableData({ className, children, ...props }, ref) {
    return (
      <td
        className={classNameWithDefaults(
          'px-6 py-3 text-black dark:text-slate-200 text-sm group-last/row:first:rounded-bl-md group-last:last:rounded-br-md',
          className
        )}
        {...props}
      >
        <div className="flex items-center">{children}</div>
      </td>
    );
  }
);

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return (
    <th className="px-6 py-3 text-sm text-left first:w-[61px] last:w-[114px] text-slate-900 dark:text-slate-100 font-semibold">
      <div className="flex items-center">{children}</div>
    </th>
  );
};

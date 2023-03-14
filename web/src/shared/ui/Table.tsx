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
import { Button } from './button';
import { Search } from './input';

export type Id = string | number;

export type TableProps<T extends Id> = {
  header: ReactNode;
  placeholder: ReactNode;
  children?:
    | ReactElement<TableRowWithIdProps<T>>
    | ReactElement<TableRowWithIdProps<T>>[]
    | null;
  updater: (id: T) => ReactElement;
  creator: () => ReactElement;
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
};

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
  placeholder,
  updater,
  creator,
  onDelete,
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

  const areAllItemsSelected = compareArrays(selectedItems, allItems);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Search />
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
      <div className="overflow-hidden border rounded-md">
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
                : placeholder}
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
      <button className="p-1 group" onClick={markEdited}>
        <FontAwesomeIcon
          icon={faPenToSquare}
          fixedWidth
          className="text-lg text-blue-500 transition-colors group-hover:text-blue-900 group-hover:scale-110"
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

Table.RowEditorActions = function TableRowEditorActions({
  onSave,
}: TableRowEditorActionsProps) {
  const { close, isExisting } = useContext(TableRowEditorContext);
  return (
    <Table.Data>
      <button
        className="flex items-center justify-center p-1 group"
        onClick={async () => {
          await onSave();
          close();
        }}
      >
        <FontAwesomeIcon
          icon={faCheck}
          fixedWidth
          className="text-xl text-neutral-600 group-hover:text-green-500 group-hover:scale-110"
        ></FontAwesomeIcon>
      </button>
      {isExisting ? (
        <button
          className="flex items-center justify-center p-1 group"
          onClick={close}
        >
          <FontAwesomeIcon
            icon={faXmark}
            fixedWidth
            className="text-xl text-neutral-600 group-hover:text-red-500 group-hover:scale-110"
          />
        </button>
      ) : (
        <button
          className="flex items-center justify-center p-1 group"
          onClick={close}
        >
          <FontAwesomeIcon
            icon={faRotateBack}
            fixedWidth
            className="text-xl text-neutral-600 group-hover:text-yellow-500 group-hover:scale-110"
          />
        </button>
      )}
    </Table.Data>
  );
};

export type TableRowWithIdProps<T extends Id> = {
  id: T;
  children?: ReactNode;
};

Table.RowWithId = function TableRowContent<T extends Id>({
  children,
}: TableRowWithIdProps<T>) {
  const { isSelected } = useContext(TableRowWithIdContext);
  return (
    <Table.Row
      className={clsx({ 'bg-white': !isSelected, 'bg-blue-50': isSelected })}
    >
      {children}
    </Table.Row>
  );
};

Table.Row = forwardRef<HTMLTableRowElement, ComponentPropsWithRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        {...props}
        ref={ref}
        className={classNameWithDefaults(
          'border-b last:border-b-0 transition-[background]',
          className ? className : 'bg-white'
        )}
      />
    );
  }
);

Table.DataPlaceholder = function TableDataPlaceholder() {
  return (
    <Table.Data>
      <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
    </Table.Data>
  );
};

Table.Data = function TableData({ children }: PropsWithChildren) {
  return (
    <td className="px-6 py-3 text-sm">
      <div className="flex items-center">{children}</div>
    </td>
  );
};

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return (
    <th className="px-6 py-3 text-sm text-left">
      <div className="flex items-center">{children}</div>
    </th>
  );
};

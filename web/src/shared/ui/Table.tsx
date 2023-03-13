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
  useCallback,
  useContext,
  useState,
} from 'react';
import { compareArrays } from '../lib/common';
import { classNameWithDefaults, clsx } from '../lib/ui';
import { Button } from './button';
import { Search } from './input';

export type Id = string | number;

export type TableProps = {
  header: ReactNode;
  placeholder: ReactNode;
  children?:
    | ReactElement<TableRowContentProps>
    | ReactElement<TableRowContentProps>[]
    | null;
  updater: (id: Id) => ReactElement;
  creator: () => ReactElement;
  onDelete: (ids: Id[]) => Promise<unknown> | unknown;
};

type AsyncAction = () => Promise<unknown> | unknown;

type ItemsMapValue = { isEditing?: boolean; isSelected?: boolean };
type ItemsMap = Map<Id, ItemsMapValue>;

type TableContext = {
  itemsMap: ItemsMap;
  allItems: Id[];
  selectedItems: Id[];
  setSelectedItems: Dispatch<SetStateAction<Id[]>>;
  toggleSelectedItem: (id: Id) => void;
  editingItems: Id[];
  addEditingItem: (id: Id) => void;
  removeEditingItem: (id: Id) => void;
  updater: (id: Id) => ReactElement;
};

const TableContext = createContext<TableContext>(undefined as any);

type TableRowManageContext = {
  close: () => void;
};

const TableRowManageContext = createContext<TableRowManageContext>(
  undefined as any
);

type TableHeaderContext = {
  areAllItemsSelected: boolean;
  selectAllItems: () => void;
  deselectAllItems: () => void;
};

type TableRowContentContext = {
  isSelected: boolean;
  toggle: () => void;
};

const TableHeaderContext = createContext<TableHeaderContext>(undefined as any);
const TableRowContentContext = createContext<TableRowContentContext>(
  undefined as any
);
// const TableRowWithIdContext = createContext(undefined as any);

export function Table({
  children,
  header,
  placeholder,
  updater,
  creator,
  onDelete,
}: TableProps) {
  const allItems = children
    ? Children.map(children, child => child.props.id)
    : [];

  const [itemsMap, setItemsMap] = useState<ItemsMap>(new Map());
  const [newItems, setNewItems] = useState<Id[]>([]);

  const addNewItem = useCallback(
    () => setNewItems(p => [Date.now(), ...p]),
    []
  );

  const updateItemById = (id: Id, data: ItemsMapValue) => {
    setItemsMap(prev => {
      const prevValue = prev.get(id);
      return new Map(
        prev.set(id, prevValue ? { ...prevValue, ...data } : data)
      );
    });
  };
  const updateManyItems = (data: ItemsMapValue) => {
    setItemsMap(prev => {
      [...prev.keys()].map(id => {
        const prevValue = prev.get(id);
        prev.set(id, prevValue ? { ...prevValue, ...data } : data);
      });
      return new Map(prev);
    });
  };
  const selectAllItems = () => {
    setItemsMap(prev => {
      allItems.forEach(id => {
        const prevValue = prev.get(id);
        const newValue = { isSelected: true };
        prev.set(id, prevValue ? { ...prevValue, ...newValue } : newValue);
      });
      return new Map(prev);
    });
  };
  const deselectAllItems = () => updateManyItems({ isSelected: false });

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
        <Button type="button" variant="primary" onClick={addNewItem}>
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
                <TableRowManageContext.Provider
                  key={id}
                  value={{
                    close: () => setNewItems(p => p.filter(v => v !== id)),
                  }}
                >
                  {creator()}
                </TableRowManageContext.Provider>
              ))}
            </>
            <>
              {children
                ? Children.map(children, child => {
                    const rowInfo = itemsMap.get(child.props.id);
                    if (rowInfo?.isEditing) {
                      return (
                        <TableRowManageContext.Provider
                          value={{
                            close: () =>
                              updateItemById(child.props.id, {
                                isEditing: false,
                              }),
                          }}
                        >
                          {updater(child.props.id)}
                        </TableRowManageContext.Provider>
                      );
                    }
                    return (
                      <TableRowContentContext.Provider
                        value={{
                          isSelected: !!rowInfo?.isSelected,
                          toggle: () =>
                            updateItemById(child.props.id, {
                              isSelected: !rowInfo?.isSelected,
                            }),
                        }}
                      >
                        {child}
                      </TableRowContentContext.Provider>
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

Table.RowSelectCheckbox = function TableRowSelectCheckbox() {
  const { isSelected, toggle } = useContext(TableRowContentContext);
  return (
    <Table.Data>
      <input type="checkbox" checked={isSelected} onChange={toggle} />
    </Table.Data>
  );
};

// Table.RowEditButton = function TableRowEditButton() {
//   return <Table.Data>
//         <button className="p-1 group" onClick={() => addEditingItem(id)}>
//           <FontAwesomeIcon
//             icon={faPenToSquare}
//             fixedWidth
//             className="text-lg text-blue-500 transition-colors group-hover:text-blue-900 group-hover:scale-110"
//           />
//         </button>
//       </Table.Data>
// }

Table.HeaderSelectCheckbox = function TableHeaderSelectCheckbox() {
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

export type TableRowCreateProps = {
  children?: ReactNode;
  onCreate: AsyncAction;
};

Table.RowCreate = function TableRowCreate({
  children,
  onCreate,
}: TableRowCreateProps) {
  const { close } = useContext(TableRowManageContext);

  return (
    <Table.Row className="bg-white">
      <Table.Data>{/* select */}</Table.Data>
      {children}
      <Table.Data>
        <button
          className="flex items-center justify-center p-1 group"
          onClick={async () => {
            await onCreate();
            close();
          }}
        >
          <FontAwesomeIcon
            icon={faCheck}
            fixedWidth
            className="text-xl text-neutral-600 group-hover:text-green-500 group-hover:scale-110"
          ></FontAwesomeIcon>
        </button>
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
      </Table.Data>
    </Table.Row>
  );
};

export type TableRowUpdateProps = {
  children?: ReactNode;
  onUpdate: AsyncAction;
};

Table.RowUpdate = function TableRowUpdate({
  children,
  onUpdate,
}: TableRowUpdateProps) {
  const { close } = useContext(TableRowManageContext);

  return (
    <Table.Row className="bg-white">
      <Table.Data>{/* select */}</Table.Data>
      {children}
      <Table.Data>
        <button
          className="flex items-center justify-center p-1 group"
          onClick={async () => {
            await onUpdate();
            close();
          }}
        >
          <FontAwesomeIcon
            icon={faCheck}
            fixedWidth
            className="text-xl text-neutral-600 group-hover:text-green-500 group-hover:scale-110"
          ></FontAwesomeIcon>
        </button>
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
      </Table.Data>
    </Table.Row>
  );
};

export type TableRowContentProps = {
  id: Id;
  children?: ReactNode;
};

Table.RowContent = function TableRowContent({
  children,
}: TableRowContentProps) {
  return <Table.Row>{children}</Table.Row>;
};

Table.Row = forwardRef<HTMLTableRowElement, ComponentPropsWithRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        {...props}
        ref={ref}
        className={classNameWithDefaults('border-b last:border-b-0', className)}
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

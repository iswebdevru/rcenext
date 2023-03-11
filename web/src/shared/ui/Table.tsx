import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ComponentPropsWithRef,
  createContext,
  Dispatch,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
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
  children: ReactNode;
  allItems: Id[];
  updater: (id: Id) => ReactElement;
  creator: () => ReactElement;
  onDelete: (ids: Id[]) => Promise<unknown> | unknown;
};

type AsyncAction = () => Promise<unknown> | unknown;

type TableContext = {
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

export function Table({
  children,
  allItems,
  header,
  updater,
  creator,
  onDelete,
}: TableProps) {
  const [selectedItems, setSelectedItems] = useState<Id[]>([]);
  const [editingItems, setEditingItems] = useState<Id[]>([]);
  const [newItems, setNewItems] = useState<Id[]>([]);

  const addNewItem = (id: Id) => setNewItems(p => [id, ...p]);
  const removeNewItem = (id: Id) => setNewItems(p => p.filter(v => v !== id));

  const addEditingItem = (id: Id) => setEditingItems(p => [...p, id]);

  const removeEditingItem = (id: Id) =>
    setEditingItems(p => p.filter(v => v !== id));

  const toggleSelectedItem = (id: Id) => {
    setSelectedItems(p => {
      if (p.includes(id)) {
        return p.filter(v => v !== id);
      }
      return [...p, id];
    });
  };

  const newRows = newItems.map(id => (
    <TableRowManageContext.Provider
      key={id}
      value={{ close: () => removeNewItem(id) }}
    >
      {creator()}
    </TableRowManageContext.Provider>
  ));

  return (
    <TableContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        toggleSelectedItem,
        editingItems,
        addEditingItem,
        removeEditingItem,
        allItems,
        updater,
      }}
    >
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
              setSelectedItems([]);
            }}
          >
            Удалить
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => addNewItem(Date.now())}
          >
            Добавить
          </Button>
        </div>
        <div className="overflow-hidden border rounded-md">
          <table className="w-full table-fixed">
            <tbody>
              <>{header}</>
              <>{newRows}</>
              <>{children}</>
            </tbody>
          </table>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export type TableRowProps = {
  id: Id;
  children?: ReactNode;
};

Table.Row = function TableRow({ id, children }: TableRowProps) {
  const {
    editingItems,
    addEditingItem,
    removeEditingItem,
    selectedItems,
    toggleSelectedItem,
    updater,
  } = useContext(TableContext);

  const isEditing = editingItems.includes(id);

  if (isEditing) {
    return (
      <TableRowManageContext.Provider
        value={{ close: () => removeEditingItem(id) }}
      >
        {updater(id)}
      </TableRowManageContext.Provider>
    );
  }

  const isSelected = selectedItems.includes(id);

  return (
    <Table.RowPlain
      className={clsx({ 'bg-blue-50': isSelected, 'bg-white': !isSelected })}
    >
      <Table.Data>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectedItem(id)}
        />
      </Table.Data>
      {children}
      <Table.Data>
        <button className="p-1 group" onClick={() => addEditingItem(id)}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            fixedWidth
            className="text-lg text-blue-500 transition-colors group-hover:text-blue-900 group-hover:scale-110"
          />
        </button>
      </Table.Data>
    </Table.RowPlain>
  );
};

Table.HeaderRow = function TableHeaderRow({ children }: PropsWithChildren) {
  const { selectedItems, setSelectedItems, allItems } =
    useContext(TableContext);

  const areAllItemsSelected = compareArrays(selectedItems, allItems);

  return (
    <Table.RowPlain className="bg-white">
      <Table.Head>
        <input
          type="checkbox"
          checked={areAllItemsSelected}
          onChange={() => {
            if (areAllItemsSelected) {
              return setSelectedItems([]);
            }
            setSelectedItems(allItems);
          }}
        />
      </Table.Head>
      {children}
      <Table.Data>{/* actions */}</Table.Data>
    </Table.RowPlain>
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
    <Table.RowPlain className="bg-white">
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
    </Table.RowPlain>
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
    <Table.RowPlain className="bg-white">
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
    </Table.RowPlain>
  );
};

Table.DataPlaceholder = function TableDataPlaceholder() {
  return (
    <Table.Data>
      <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
    </Table.Data>
  );
};

Table.RowPlain = forwardRef<HTMLTableRowElement, ComponentPropsWithRef<'tr'>>(
  function TableRowPlain({ className, ...props }, ref) {
    return (
      <tr
        {...props}
        ref={ref}
        className={classNameWithDefaults('border-b last:border-b-0', className)}
      />
    );
  }
);

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

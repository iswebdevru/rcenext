import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Children,
  cloneElement,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { arrayN, compareArrays } from '../lib/common';
import { clsx } from '../lib/ui';
import { Button } from './button';
import { Search } from './input';

export type Id = string | number;
export type TableProps = {
  onDelete: (ids: Id[]) => Promise<void> | void;
  header: ReactNode;
  children: ReactElement<TableRowProps> | ReactElement<TableRowProps>[] | null;
  manager: ReactElement;
  cols: number;
};

type TableContext = {
  selectedItems: Id[];
  setSelectedItems: Dispatch<SetStateAction<Id[]>>;
  allItems: Id[];
};

const TableContext = createContext<TableContext>(undefined as any);

export type TableManagerContext = {
  id: Id;
  isNew: boolean;
  closeManager: () => void;
};

const TableManagerContext = createContext<TableManagerContext>(
  undefined as any
);

export function useTableManagerContext() {
  return useContext(TableManagerContext);
}

export function Table({
  children,
  onDelete,
  header,
  manager,
  cols,
}: TableProps) {
  const [selectedItems, setSelectedItems] = useState<Id[]>([]);
  const [editableRowsIds, setEditableRowsIds] = useState<Id[]>([]);
  const [newRowsIds, setNewRowsIds] = useState<Id[]>([]);

  const addNewRow = (id: Id) => setNewRowsIds(p => [id, ...p]);
  const closeNewRow = (id: Id) => setNewRowsIds(p => p.filter(v => v !== id));

  const addEditableRow = (id: Id) => setEditableRowsIds(p => [...p, id]);

  const closeEditableRow = (id: Id) =>
    setEditableRowsIds(p => p.filter(v => v !== id));

  const toggleSelectedItem = (id: Id) => {
    setSelectedItems(p => {
      if (p.includes(id)) {
        return p.filter(v => v !== id);
      }
      return [...p, id];
    });
  };

  const allItems = children
    ? Children.map(children, child => child.props.id)
    : [];

  const newRows = newRowsIds.map(id => (
    <TableManagerContext.Provider
      key={id}
      value={{ id, isNew: true, closeManager: () => closeNewRow(id) }}
    >
      {cloneElement(manager)}
    </TableManagerContext.Provider>
  ));

  const rows = children
    ? Children.map(children, row => {
        const isSelected = selectedItems.includes(row.props.id);

        if (editableRowsIds.includes(row.props.id)) {
          return (
            <TableManagerContext.Provider
              value={{
                id: row.props.id,
                isNew: false,
                closeManager: () => closeEditableRow(row.props.id),
              }}
            >
              {cloneElement(manager)}
            </TableManagerContext.Provider>
          );
        }

        return (
          <tr
            className={clsx({
              'border-b last:border-b-0': true,
              'bg-blue-50': isSelected,
              'bg-white': !isSelected,
            })}
          >
            {
              <Table.Data>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectedItem(row.props.id)}
                />
              </Table.Data>
            }
            {row.props.children}
            {
              <Table.Data>
                <button
                  className="p-1 group"
                  onClick={() => addEditableRow(row.props.id)}
                >
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    fixedWidth
                    className="text-lg text-blue-500 transition-colors group-hover:text-blue-900 group-hover:scale-110"
                  />
                </button>
              </Table.Data>
            }
          </tr>
        );
      })
    : children;

  return (
    <TableContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
        allItems,
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
            onClick={() => addNewRow(Date.now())}
          >
            Добавить
          </Button>
        </div>
        <div className="overflow-hidden border rounded-md">
          <table className="w-full table-fixed">
            <tbody>
              <>{header}</>
              <>{newRows}</>
              <>
                {children
                  ? rows
                  : arrayN(10).map(i => (
                      <Table.PlaceholderRow key={i} cols={cols + 2} />
                    ))}
              </>
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

Table.Row = function TableRow(_: TableRowProps) {
  return null;
};

Table.HeaderRow = function TableHeaderRow({ children }: PropsWithChildren) {
  const { selectedItems, setSelectedItems, allItems } =
    useContext(TableContext);

  const areAllItemsSelected = compareArrays(selectedItems, allItems);

  return (
    <tr className="bg-white border-b last:border-b-0">
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
    </tr>
  );
};

export type TableManagerRowProps = {
  children?: ReactNode;
  onCreate: () => void | Promise<void>;
  onUpdate: () => void | Promise<void>;
};

Table.ManagerRow = function TableManagerRow({
  children,
  onCreate,
  onUpdate,
}: TableManagerRowProps) {
  const { isNew, closeManager } = useTableManagerContext();

  return (
    <tr className="bg-white border-b last:border-b-0">
      <Table.Data>{/* select action */}</Table.Data>
      {children}
      {isNew ? (
        <Table.Data>
          <button
            className="flex items-center justify-center p-1 group"
            onClick={async () => {
              await onCreate();
              closeManager();
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
            onClick={closeManager}
          >
            <FontAwesomeIcon
              icon={faXmark}
              fixedWidth
              className="text-xl text-neutral-600 group-hover:text-red-500 group-hover:scale-110"
            />
          </button>
        </Table.Data>
      ) : (
        <Table.Data>
          <button
            className="flex items-center justify-center p-1 group"
            onClick={async () => {
              await onUpdate();
              closeManager();
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
            onClick={closeManager}
          >
            <FontAwesomeIcon
              icon={faRotateBack}
              fixedWidth
              className="text-xl text-neutral-600 group-hover:text-yellow-500 group-hover:scale-110"
            />
          </button>
        </Table.Data>
      )}
    </tr>
  );
};

export type TablePlaceholderRowProps = {
  cols: number;
};

Table.PlaceholderRow = function TablePlaceholderRow({
  cols,
}: TablePlaceholderRowProps) {
  return (
    <tr className="bg-white border-b last:border-b-0">
      {arrayN(cols).map(i => (
        <Table.Data key={i}>
          <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
        </Table.Data>
      ))}
    </tr>
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

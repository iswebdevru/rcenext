import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Children,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { compareArrays } from '../lib/common';
import { clsx } from '../lib/ui';
import { Button } from './button';
import { Search } from './input';

export type Id = string | number;
export type TableProps = {
  onDelete: (ids: Id[]) => void;
  onSave: (id?: number | string) => void;
  header: ReactNode;
  children: ReactElement<TableRowProps> | ReactElement<TableRowProps>[];
  EditComponent: (props: TableEditableRowProps) => JSX.Element;
};

type TableContext = {
  selectedItems: Id[];
  setSelectedItems: Dispatch<SetStateAction<Id[]>>;
  allItems: Id[];
};

const TableContext = createContext<TableContext>(undefined as any);

export function Table({
  children,
  onDelete,
  onSave,
  header,
  EditComponent,
}: TableProps) {
  const [selectedItems, setSelectedItems] = useState<Id[]>([]);
  const [editableRowsIds, setEditableRowsIds] = useState<Id[]>([]);
  const [newRowsIds, setNewRowsIds] = useState<number[]>([]);

  const addNewRow = (id: number) => setNewRowsIds(p => [...p, id]);
  const delNewRow = (id: number) => setNewRowsIds(p => p.filter(v => v !== id));

  const toggleEditableRow = (id: Id) => {
    setEditableRowsIds(p => {
      if (p.includes(id)) {
        return p.filter(v => v !== id);
      }
      return [...p, id];
    });
  };
  const delEditableRow = (id: Id) =>
    setEditableRowsIds(p => p.filter(v => v !== id));

  const toggleSelectedItem = (id: Id) => {
    setSelectedItems(p => {
      if (p.includes(id)) {
        return p.filter(v => v !== id);
      }
      return [...p, id];
    });
  };

  const allItems = Children.map(children, child => child.props.id);

  const newRows = newRowsIds.map(id => (
    <tr key={id} className="bg-white border-b last:border-b-0">
      <Table.Data></Table.Data>
      <EditComponent />
      {
        <Table.Data>
          <button className="flex items-center justify-center p-1 group">
            <FontAwesomeIcon
              icon={faCheck}
              fixedWidth
              className="text-xl text-neutral-600 group-hover:text-green-500 group-hover:scale-110"
            ></FontAwesomeIcon>
          </button>
          <button
            className="flex items-center justify-center p-1 group"
            onClick={() => delNewRow(id)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              fixedWidth
              className="text-xl text-neutral-600 group-hover:text-red-500 group-hover:scale-110"
            />
          </button>
        </Table.Data>
      }
    </tr>
  ));

  const rows = Children.map(children, row => {
    const isSelected = selectedItems.includes(row.props.id);

    if (editableRowsIds.includes(row.props.id)) {
      return (
        <tr className="bg-white border-b last:border-b-0">
          <Table.Data></Table.Data>
          <EditComponent id={row.props.id} />
          {
            <Table.Data>
              <button className="flex items-center justify-center p-1 group">
                <FontAwesomeIcon
                  icon={faCheck}
                  fixedWidth
                  className="text-xl text-neutral-600 group-hover:text-green-500 group-hover:scale-110"
                ></FontAwesomeIcon>
              </button>
              <button
                className="flex items-center justify-center p-1 group"
                onClick={() => delEditableRow(row.props.id)}
              >
                <FontAwesomeIcon
                  icon={faRotateBack}
                  fixedWidth
                  className="text-xl text-neutral-600 group-hover:text-yellow-500 group-hover:scale-110"
                />
              </button>
            </Table.Data>
          }
        </tr>
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
              onClick={() => toggleEditableRow(row.props.id)}
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
  });

  return (
    <TableContext.Provider
      value={{ selectedItems, setSelectedItems, allItems }}
    >
      <div>
        <div className="flex gap-4 mb-4">
          <Search />
          <Button
            type="button"
            variant="danger-outline"
            disabled={!selectedItems.length}
            className="ml-auto"
            onClick={() => onDelete(selectedItems)}
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
              <>
                {header}
                {newRows}
                {rows}
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
export type TableEditableRowProps = {
  id?: Id;
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

Table.EditRow = function TableEditRow({ children }: PropsWithChildren) {
  return <tr className="bg-white border-b last:border-b-0">{children}</tr>;
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

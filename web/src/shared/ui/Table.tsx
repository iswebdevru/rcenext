import { faPenToSquare, faRotateBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Children, PropsWithChildren, ReactElement, useState } from 'react';
import { compareArrays } from '../lib/common';
import { clsx } from '../lib/ui';
import { Button } from './button';
import { Search } from './input';

export type Id = string | number;

export type TableProps = {
  onDelete: (ids: Id[]) => void;
  children: ReactElement<TableRowProps>[];
  EditComponent: (props: TableEditRowProps) => JSX.Element;
};

export function Table({ children, onDelete, EditComponent }: TableProps) {
  const [selectedItems, setSelectedItems] = useState<Id[]>([]);
  const [editableRowsIds, setEditableRowsIds] = useState<Id[]>([]);
  const [newRowsIds, setNewRowsIds] = useState<number[]>([]);

  const allItems = Children.map(children, child => child.props.id).filter(
    id => id !== undefined
  );

  const allSelectedItems = compareArrays(selectedItems, allItems);

  const newRows = newRowsIds.map(i => (
    <tr key={i} className="bg-white border-b last:border-b-0">
      <Table.Data></Table.Data>
      <EditComponent />
      {
        <Table.Data>
          <button
            className="p-1 group"
            onClick={() => setNewRowsIds(p => p.filter(v => v !== i))}
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
  ));

  const rows = Children.map(children, row => {
    if (row.props.head) {
      return (
        <>
          <tr className="bg-white border-b last:border-b-0">
            <Table.Head>
              <input
                type="checkbox"
                checked={allSelectedItems}
                onChange={() => {
                  if (allSelectedItems) {
                    return setSelectedItems([]);
                  }
                  setSelectedItems(allItems);
                }}
              />
            </Table.Head>
            {row.props.children}
            <Table.Data></Table.Data>
          </tr>
          {newRows}
        </>
      );
    }
    const id = row.props.id;
    const isSelected = selectedItems.includes(id);

    if (editableRowsIds.includes(id)) {
      return (
        <tr className="bg-white border-b last:border-b-0">
          <Table.Data></Table.Data>
          <EditComponent id={id} />
          {
            <Table.Data>
              <button
                className="flex items-center justify-center p-1 group"
                onClick={() => setEditableRowsIds(p => p.filter(v => v !== id))}
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
              onChange={() =>
                setSelectedItems(p => {
                  if (p.includes(id)) {
                    return p.filter(v => v !== id);
                  }
                  return [...p, id];
                })
              }
            />
          </Table.Data>
        }
        {row.props.children}
        {
          <Table.Data>
            <button
              className="p-1 group"
              onClick={() => {
                setEditableRowsIds(p => [...p, id]);
              }}
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
          onClick={() => setNewRowsIds(p => [Date.now(), ...p])}
        >
          Добавить
        </Button>
      </div>
      <div className="overflow-hidden border rounded-md">
        <table className="w-full">
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}

type TableRowHeadProps = {
  head: true;
  id?: undefined;
} & PropsWithChildren;

type TableRowContentProps = {
  head?: false;
  id: Id;
} & PropsWithChildren;

export type TableRowProps = TableRowHeadProps | TableRowContentProps;
export type TableEditRowProps = {
  id?: Id;
};

Table.Row = function TableRow(_: TableRowProps) {
  return null;
};

export type TableDataProps = {} & PropsWithChildren;

Table.Data = function TableData({ children }: TableDataProps) {
  return (
    <td className="px-6 py-3 text-sm">
      <div className="flex items-center">{children}</div>
    </td>
  );
};

export type TableHeadProps = {} & PropsWithChildren;

Table.Head = function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-6 py-3 text-sm text-left">
      <div className="flex items-center">{children}</div>
    </th>
  );
};

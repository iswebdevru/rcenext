import { Children, PropsWithChildren, ReactElement, useState } from 'react';
import { compareArrays } from '../lib/common';
import { className } from '../lib/ui';
import { Button } from './button';
import { Search } from './input';

export type TableProps = {
  onDelete: (ids: (string | number)[]) => void;
  children: ReactElement<TableRowProps>[];
};

export function Table({ children, onDelete }: TableProps) {
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [showCreator, setShowCreator] = useState(false);

  const allItems = Children.map(children, child => child.props.id).filter(
    id => id !== undefined
  );

  const allSelected = compareArrays(selectedItems, allItems);

  const rows = Children.map(children, row => {
    if (row.props.head) {
      return (
        <tr className="border-b">
          <Table.Head>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  return setSelectedItems([]);
                }
                setSelectedItems(allItems);
              }}
            />
          </Table.Head>
          {row.props.children}
          <Table.Data></Table.Data>
        </tr>
      );
    }
    if (row.props.creator) {
      if (showCreator) {
        return (
          <tr className="border-b">
            <Table.Data></Table.Data>
            {row.props.children}
            <Table.Data>
              <button onClick={() => setShowCreator(false)}>Отменить</button>
            </Table.Data>
          </tr>
        );
      }
      return null;
    }
    const id = row.props.id;
    const isSelected = selectedItems.includes(id);
    return (
      <tr
        className={className({
          'border-b': true,
          'bg-blue-50': isSelected,
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
        {row.props.head ? null : (
          <Table.Data>
            <button>edit</button>
          </Table.Data>
        )}
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
          disabled={showCreator}
          onClick={() => setShowCreator(p => !p)}
        >
          Добавить
        </Button>
      </div>
      <table className="w-full bg-white border">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

type TableRowHeadProps = {
  head: true;
  id?: undefined;
  editing?: false;
  creator?: false;
} & PropsWithChildren;

type TableRowCreatorProps = {
  head?: false;
  id?: undefined;
  editing?: false;
  creator: true;
} & PropsWithChildren;

type TableRowContentProps = {
  head?: false;
  id: number | string;
  editing?: boolean;
  creator?: boolean;
} & PropsWithChildren;

export type TableRowProps =
  | TableRowHeadProps
  | TableRowContentProps
  | TableRowCreatorProps;

Table.Row = function TableRow(_: TableRowProps) {
  return null;
};

export type TableDataProps = {} & PropsWithChildren;

Table.Data = function TableData({ children }: TableDataProps) {
  return (
    <td className="px-6 py-3">
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

/**
 * The idea:
 * <Table onDelete={(ids) => void}>
 *   <Table.Row>
 *      <Table.Head>1</Table.Head>
 *      <Table.Head>2</Table.Head>
 *      <Table.Head>3</Table.Head>
 *   </Table.Row>
 *   <Table.Row editing={true} show={true|false}>
 *     <Table.Data>1</Table.Data>
 *     <Table.Data>1</Table.Data>
 *     <Table.Data>1</Table.Data>
 *   </Table.Row>
 *   <Table.Row id={id}>
 *      <Table.Data>1</Table.Data>
 *      <Table.Data>2</Table.Data>
 *      <Table.Data>3</Table.Data>
 *   </Table.Row>
 * </Table>
 *
 */

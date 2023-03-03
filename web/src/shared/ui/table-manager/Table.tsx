import { PropsWithChildren } from 'react';

export type TableProps = {} & PropsWithChildren;

export function Table({ children }: TableProps) {
  return (
    <div>
      <table>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export type TableRowProps = {
  id: number | string;
  editing: boolean;
} & PropsWithChildren;

Table.Row = function TableRow({ children, editing = false }: TableRowProps) {
  return <tr>{children}</tr>;
};

Table.Data = function TableData() {
  return <td>hello there</td>;
};

Table.Head = function TableHead() {
  return <th>hello head</th>;
};

/**
 * const [selectedItems, setSelectedItems] = useState([]);
 *
 * The idea:
 * <Table setSelected={setSelectedItems}>
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

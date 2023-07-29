'use client';

// TODO: separate Table on different files...

import {
  faCheck,
  faPenToSquare,
  faRotateBack,
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
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { clsx } from '../lib/ui';
import { Button, SearchField } from './Controls';

export type Id = string | number;

type AsyncAction = () => Promise<unknown> | unknown;

type TableRowContext = {
  isSelected: boolean;
  toggleSelect: () => void;
  toggleEdit: () => void;
};

const TableRowContext = createContext<TableRowContext | undefined>(undefined);

type TableContext<T extends Id> = {
  visibleItems: T[];
  setVisibleItems: Dispatch<SetStateAction<T[]>>;
  selectedItems: Set<Id>;
  setSelectedItems: Dispatch<SetStateAction<Set<Id>>>;
  editingItems: Set<Id>;
  setEditingItems: Dispatch<SetStateAction<Set<Id>>>;
};

const TableContext = createContext<TableContext<any>>({} as any);

export function Table<T extends Id>({ children }: PropsWithChildren) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<Id>>(new Set());
  const [editingItems, setEditingItems] = useState<Set<Id>>(new Set());

  return (
    <TableContext.Provider
      value={{
        visibleItems,
        setVisibleItems,
        selectedItems,
        setSelectedItems,
        editingItems,
        setEditingItems,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export type TableControlsProps<T extends Id> = {
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
  search: string;
  onSearchChange: (search: string) => void;
};

export function TableControls<T extends Id>({
  onDelete,
  onSearchChange,
  search,
}: TableControlsProps<T>) {
  const [isDisabled, setIsDisabled] = useState(false);
  const { visibleItems, selectedItems, setSelectedItems } =
    useContext<TableContext<T>>(TableContext);

  const itemsToDelete = visibleItems.filter(id => selectedItems.has(id));

  const handleDelete = async () => {
    setIsDisabled(true);
    await onDelete(itemsToDelete);
    setSelectedItems(prev => {
      const updated = new Set(prev);
      itemsToDelete.forEach(id => updated.delete(id));
      return updated;
    });
    setIsDisabled(false);
  };

  return (
    <div className="mb-3 flex items-center gap-4 rounded-md rounded-tr-md border border-zinc-200 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
      <SearchField
        onChange={e => onSearchChange(e.currentTarget.value)}
        value={search}
        placeholder="Поиск"
        name="search"
        autoComplete="off"
        className="max-w-lg"
      />
      <div className="ml-auto">
        <Button
          type="button"
          variant="danger-outline"
          disabled={!itemsToDelete.length || isDisabled}
          onClick={handleDelete}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
}

export function TableMain({ children }: PropsWithChildren) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full table-fixed border-separate border-spacing-0 rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: PropsWithChildren) {
  return <thead className="group/thead">{children}</thead>;
}

export type TableBodyProps<T extends Id> = {
  children?:
    | ReactElement<TableRowProps<T>>
    | ReactElement<TableRowProps<any>>[];
  editingRow?: (id: T) => ReactElement;
};

export function TableBody<T extends Id>({
  children,
  editingRow,
}: TableBodyProps<T>) {
  const {
    setVisibleItems,
    selectedItems,
    setSelectedItems,
    editingItems,
    setEditingItems,
  } = useContext(TableContext);

  useEffect(() => {
    setVisibleItems(() => {
      if (!children) {
        return [];
      }
      return Children.map(children, child => child.props.rowId);
    });
  }, [children, setVisibleItems]);

  return (
    <tbody>
      {children
        ? Children.map(children, child => {
            const id = child.props.rowId;
            const isEditing = editingItems.has(id);
            const isSelected = selectedItems.has(id);
            return (
              <TableRowContext.Provider
                key={id}
                value={{
                  isSelected,
                  toggleSelect: () =>
                    setSelectedItems(prev => {
                      const updated = new Set(prev);
                      if (updated.has(id)) {
                        updated.delete(id);
                      } else {
                        updated.add(id);
                      }
                      return updated;
                    }),
                  toggleEdit: () =>
                    setEditingItems(prev => {
                      const updated = new Set(prev);
                      if (updated.has(id)) {
                        updated.delete(id);
                      } else {
                        updated.add(id);
                      }
                      return updated;
                    }),
                }}
              >
                {isEditing && editingRow ? editingRow(id) : child}
              </TableRowContext.Provider>
            );
          })
        : null}
    </tbody>
  );
}

export function TableSelectRowCheckbox() {
  const { isSelected, toggleSelect } = useContext(
    TableRowContext,
  ) as TableRowContext;
  return <input type="checkbox" checked={isSelected} onChange={toggleSelect} />;
}

export function TableButtonEdit() {
  const { toggleEdit } = useContext(TableRowContext) as TableRowContext;
  return (
    <button type="button" className="group/edit-btn p-1" onClick={toggleEdit}>
      <FontAwesomeIcon
        icon={faPenToSquare}
        fixedWidth
        className="text-lg text-blue-500 transition-colors group-hover/edit-btn:scale-110 group-hover/edit-btn:text-blue-900"
      />
    </button>
  );
}

export function TableSelectAllRowsCheckbox() {
  const { visibleItems, selectedItems, setSelectedItems } =
    useContext(TableContext);

  const allVisibleItemsSelected =
    !!visibleItems.length && visibleItems.every(id => selectedItems.has(id));

  return (
    <input
      type="checkbox"
      checked={allVisibleItemsSelected}
      onChange={() => {
        setSelectedItems(prev => {
          const updated = new Set(prev);
          if (allVisibleItemsSelected) {
            visibleItems.forEach(id => updated.delete(id));
          } else {
            visibleItems.forEach(id => updated.add(id));
          }
          return updated;
        });
      }}
    />
  );
}

export function TableButtonCancel() {
  const ctx = useContext(TableRowContext)!;

  return (
    <button
      type="button"
      className="group/editor-cancel flex items-center justify-center p-1"
      onClick={ctx?.toggleEdit}
    >
      <FontAwesomeIcon
        icon={faRotateBack}
        fixedWidth
        className="text-lg text-neutral-600 group-hover/editor-cancel:scale-110 group-hover/editor-cancel:text-yellow-500"
      />
    </button>
  );
}

export type TableButtonCreateProps = {
  onSave: AsyncAction;
};

export type TableButtonUpdateProps = TableButtonCreateProps;

export function TableButtonUpdate({ onSave }: TableButtonUpdateProps) {
  const ctx = useContext(TableRowContext) as TableRowContext;

  const handleUpdate = async () => {
    await onSave();
    ctx.toggleEdit();
  };

  return (
    <button
      className="group/editor-save flex shrink-0 items-center justify-center p-1"
      onClick={handleUpdate}
    >
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        className="text-lg text-neutral-600 group-hover/editor-save:scale-110 group-hover/editor-save:text-green-500"
      ></FontAwesomeIcon>
    </button>
  );
}

export type TableRowProps<T extends Id = Id> = {
  rowId?: T;
} & ComponentPropsWithRef<'tr'>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, rowId, ...props }, ref) {
    return (
      <tr
        {...props}
        ref={ref}
        className={clsx(
          className,
          'group/row rounded-md transition-[background]',
        )}
      />
    );
  },
);

export function TableDataPlaceholder() {
  return (
    <TableDataCell>
      <div className="h-8 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </TableDataCell>
  );
}

export const TableDataCell = forwardRef<
  HTMLTableCellElement,
  ComponentPropsWithRef<'td'>
>(function TableDataCell({ className, children, ...props }, ref) {
  const ctx = useContext(TableRowContext);

  return (
    <td
      className={clsx(
        className,
        'border-b border-zinc-200 p-0 text-sm text-black group-last/row:border-0 group-last/row:first:rounded-bl-md group-last:last:rounded-br-md dark:border-zinc-700 dark:text-zinc-200',
        !!ctx?.isSelected && 'bg-zinc-50 dark:bg-zinc-800',
      )}
      {...props}
    >
      <div className="flex items-center px-6 py-3">{children}</div>
    </td>
  );
});

export function TableHeadCell({ children }: PropsWithChildren) {
  return (
    <th className="border-b border-zinc-200 p-0 text-left text-sm font-semibold text-slate-900 first:w-[61px] first:rounded-tl-md last:w-[114px] last:rounded-tr-md dark:border-zinc-700 dark:text-slate-100">
      <div className="flex h-12 items-center px-6 py-3">{children}</div>
    </th>
  );
}

// Let's rethink <Table> component...

/**
 * <Table
 *   updater={fn}
 * >
 *  <Table.Controls
 *    onDelete={fn}
 *    searchStr={string}
 *    onSearchStrChange={string}
 *  />
 *  <Table.Head>
 *    <Table.Row>
 *      <Table.HeadCell />
 *      <Table.HeadCell />
 *      <Table.HeadCell />
 *    </Table.Row>
 *  </Table.Head>
 *  <Table.Body>
 *    <Table.RowEntity id={unique}>
 *      <Table.DataCell />
 *      <Table.DataCell />
 *    </Table.RowEntity>
 *  </Table.Body>
 * </Table>
 */

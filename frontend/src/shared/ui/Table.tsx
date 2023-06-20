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
import { classNameWithDefaults, clsx, russianEnding } from '../lib/ui';
import { Button } from './Button';
import { InputSearch } from './Input';
import { useNotificationEmitter } from './Notification';

export type Id = string | number;

export type TableCreatorComponentProps = {
  refresh: AsyncAction;
};

export type TableUpdaterComponentProps<T> = {
  id: T;
} & TableCreatorComponentProps;

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

const TableContext = createContext<TableContext<any>>(undefined as any);

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
      <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        {children}
      </div>
    </TableContext.Provider>
  );
}

export type TableControlsProps<T extends Id> = {
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
  search: string;
  onSearchChange: (search: string) => void;
};

Table.Controls = function TableControls<T extends Id>({
  onDelete,
  onSearchChange,
  search,
}: TableControlsProps<T>) {
  const notify = useNotificationEmitter();
  const [isDisabled, setIsDisabled] = useState(false);
  const { visibleItems, selectedItems, setSelectedItems } =
    useContext<TableContext<T>>(TableContext);

  const itemsToDelete = visibleItems.filter(id => selectedItems.has(id));

  const handleDelete = async () => {
    setIsDisabled(true);
    try {
      await onDelete(itemsToDelete);
      notify({
        kind: 'success',
        text: `Удалено: ${itemsToDelete.length} запис${russianEnding(
          itemsToDelete.length,
          ['ь', 'и', 'ей']
        )}`,
      });
      setSelectedItems(prev => {
        const updated = new Set(prev);
        itemsToDelete.forEach(id => updated.delete(id));
        return updated;
      });
    } catch (e) {
      notify({
        kind: 'error',
        text: `Ошибка: не удалось выполнить удаление ${
          itemsToDelete.length
        } запис${russianEnding(itemsToDelete.length, ['и', 'ей', 'ей'])}`,
      });
    }
    setIsDisabled(false);
  };

  return (
    <div className="flex gap-4 border-b border-zinc-200 p-4 dark:border-zinc-700">
      <InputSearch
        onChange={e => onSearchChange(e.currentTarget.value)}
        value={search}
      />
      <Button
        type="button"
        variant="danger-outline"
        disabled={!itemsToDelete.length || isDisabled}
        className="ml-auto"
        onClick={handleDelete}
      >
        Удалить
      </Button>
    </div>
  );
};

Table.Main = function TableMain({ children }: PropsWithChildren) {
  return <table className="w-full table-fixed">{children}</table>;
};

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return <thead className="group/thead">{children}</thead>;
};

export type TableBodyProps<T extends Id> = {
  children?:
    | ReactElement<TableRowProps<T>>
    | ReactElement<TableRowProps<any>>[];
  updater: (id: T) => ReactElement;
};

Table.Body = function TableBody<T extends Id>({
  children,
  updater,
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
                {isEditing ? updater(id) : child}
              </TableRowContext.Provider>
            );
          })
        : null}
    </tbody>
  );
};

Table.SelectRowCheckbox = function TableSelectRowCheckbox() {
  const { isSelected, toggleSelect } = useContext(
    TableRowContext
  ) as TableRowContext;
  return <input type="checkbox" checked={isSelected} onChange={toggleSelect} />;
};

Table.ButtonEdit = function TableButtonEdit() {
  const { toggleEdit } = useContext(TableRowContext) as TableRowContext;
  return (
    <button className="group/edit-btn p-1" onClick={toggleEdit}>
      <FontAwesomeIcon
        icon={faPenToSquare}
        fixedWidth
        className="text-lg text-blue-500 transition-colors group-hover/edit-btn:scale-110 group-hover/edit-btn:text-blue-900"
      />
    </button>
  );
};

Table.SelectAllRowsCheckbox = function TableSelectAllRowsCheckbox() {
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
};

Table.ButtonCancel = function TableButtonCancel() {
  const ctx = useContext(TableRowContext)!;

  return (
    <button
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
};

export type TableButtonCreateProps = {
  onSave: AsyncAction;
};

export type TableButtonUpdateProps = TableButtonCreateProps;

Table.ButtonUpdate = function TableButtonUpdate({
  onSave,
}: TableButtonUpdateProps) {
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
};

export type TableRowProps<T extends Id = Id> = {
  rowId?: T;
} & ComponentPropsWithRef<'tr'>;

Table.Row = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, rowId, ...props },
  ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      className={classNameWithDefaults(
        clsx({
          'group/row rounded-md border-b border-zinc-200 transition-[background] last:border-0 group-[]/thead:border-b dark:border-zinc-700':
            true,
        }),
        className
      )}
    />
  );
});

Table.DataLoader = function TableDataPlaceholder() {
  return (
    <Table.DataCell>
      <div className="h-8 w-full animate-pulse rounded-md bg-neutral-200"></div>
    </Table.DataCell>
  );
};

Table.DataCell = forwardRef<HTMLTableCellElement, ComponentPropsWithRef<'td'>>(
  function TableDataCell({ className, children, ...props }, ref) {
    const ctx = useContext(TableRowContext);

    return (
      <td
        className={classNameWithDefaults(
          clsx({
            'p-0 text-sm text-black group-last/row:first:rounded-bl-md group-last:last:rounded-br-md dark:text-zinc-200':
              true,
            'bg-zinc-50 dark:bg-zinc-700': !!ctx?.isSelected,
          }),
          className
        )}
        {...props}
      >
        <div
          className={clsx({
            'flex items-center px-6 py-3': true,
          })}
        >
          {children}
        </div>
      </td>
    );
  }
);

Table.HeadCell = function TableHeadCell({ children }: PropsWithChildren) {
  return (
    <th className="text-left text-sm font-semibold text-slate-900 first:w-[61px] last:w-[114px] dark:text-slate-100">
      <div className="flex h-12 items-center px-6 py-3">{children}</div>
    </th>
  );
};

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

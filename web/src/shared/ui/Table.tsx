import {
  faCheck,
  faPenToSquare,
  faRotateBack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEventHandler,
  Children,
  ComponentPropsWithRef,
  createContext,
  Dispatch,
  forwardRef,
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { compareArrays } from '../lib/common';
import { classNameWithDefaults, clsx } from '../lib/ui';
import { Button } from './Button';
import { InputSearch } from './Input';
import React from 'react';
import { v4 as uuid } from 'uuid';

/**
 * <Table>
 *    <Table.Header onDelete={} onSearchChange={} />
 *    <Table.Body>
 *      <Table.Row></Table.Row>
 *      <Table.Row></Table.Row>
 *    <TableBody />
 * <Table/>
 */

export type Id = string | number;

export type TableCreatorComponentProps = {
  refresh: AsyncAction;
};

export type TableUpdaterComponentProps<T> = {
  id: T;
} & TableCreatorComponentProps;

type AsyncAction = () => Promise<unknown> | unknown;

type ItemsMapValue = { state: 'show' | 'edit' | 'hide'; isSelected: boolean };
type ItemsMap<K extends Id> = Map<K, ItemsMapValue>;

type TableRowContextExisting = {
  kind: 'existing';
  state: 'show' | 'edit' | 'hide';
  isSelected: boolean;
  toggleSelect: () => void;
  markEdited: () => void;
  close: () => void;
};
type TableRowContextNew = {
  kind: 'new';
  state: 'show' | 'hide';
  close: () => void;
};

type TableRowContext = TableRowContextExisting | TableRowContextNew;

const TableRowContext = createContext<TableRowContext | undefined>(undefined);

type TableContext<T extends Id> = {
  allItems: MutableRefObject<T[]>;

  existingItemsMap: ItemsMap<T>;
  selectedItems: T[];
  areAllItemsSelected: boolean;
  selectAllExistingItems: () => void;
  deselectAllExistingItems: () => void;
  updateExistingItemById: (id: T, data: Partial<ItemsMapValue>) => void;

  newItems: string[];
  setNewItems: Dispatch<SetStateAction<string[]>>;
};

const DEFAULT_ITEM_VALUE: ItemsMapValue = {
  state: 'show',
  isSelected: false,
};

const TableContext = createContext<TableContext<any>>(undefined as any);

export function Table<T extends Id>({ children }: PropsWithChildren) {
  const allItems = useRef<T[]>([]);

  const [existingItemsMap, setExistingItemsMap] = useState<ItemsMap<T>>(
    new Map()
  );
  const [newItems, setNewItems] = useState<string[]>([]);

  const updateExistingItemById = useCallback(
    (id: T, data: Partial<ItemsMapValue>) => {
      setExistingItemsMap(prev => {
        const prevValue = prev.get(id);
        return new Map(
          prev.set(id, { ...DEFAULT_ITEM_VALUE, ...prevValue, ...data })
        );
      });
    },
    []
  );
  const updateManyItems = useCallback((data: Partial<ItemsMapValue>) => {
    setExistingItemsMap(prev => {
      [...prev.keys()].map(id => {
        const prevValue = prev.get(id);
        prev.set(id, { ...DEFAULT_ITEM_VALUE, ...prevValue, ...data });
      });
      return new Map(prev);
    });
  }, []);
  const selectAllExistingItems = useCallback(() => {
    setExistingItemsMap(prev => {
      allItems.current.forEach(id => {
        const prevValue = prev.get(id);
        prev.set(id, { ...DEFAULT_ITEM_VALUE, ...prevValue, isSelected: true });
      });
      return new Map(prev);
    });
  }, [allItems]);
  const deselectAllExistingItems = useCallback(
    () => updateManyItems({ isSelected: false }),
    [updateManyItems]
  );

  const selectedItems = [...existingItemsMap.entries()]
    .filter(([_, info]) => info.isSelected)
    .map(([id]) => id);

  const areAllItemsSelected =
    selectedItems.length !== 0 &&
    compareArrays(selectedItems, allItems.current);

  return (
    <TableContext.Provider
      value={{
        allItems,
        existingItemsMap,
        selectedItems,
        areAllItemsSelected,
        selectAllExistingItems,
        deselectAllExistingItems,
        updateExistingItemById,
        newItems,
        setNewItems,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export type TableHeaderProps<T extends Id> = {
  onDelete: (ids: T[]) => Promise<unknown> | unknown;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
};

Table.Header = function TableHeader<T extends Id>({
  onDelete,
  onSearchChange,
}: TableHeaderProps<T>) {
  const { selectedItems, deselectAllExistingItems, setNewItems } =
    useContext<TableContext<T>>(TableContext);
  return (
    <div className="flex gap-4 mb-4">
      <InputSearch onChange={onSearchChange} />
      <Button
        type="button"
        variant="danger-outline"
        disabled={!selectedItems.length}
        className="ml-auto"
        onClick={async () => {
          await onDelete(selectedItems);
          deselectAllExistingItems();
        }}
      >
        Удалить
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={() => setNewItems(p => [uuid(), ...p])}
      >
        Добавить
      </Button>
    </div>
  );
};

export type TableBodyProps<T extends Id> = {
  children?:
    | ReactElement<TableRowProps<T>>
    | ReactElement<TableRowProps<any>>[];
  header: ReactNode;
  updater: (id: T) => ReactElement;
  creator: () => ReactElement;
};

Table.Body = function TableBody<T extends Id>({
  children,
  updater,
  creator,
  header,
}: TableBodyProps<T>) {
  const {
    existingItemsMap,
    allItems,
    updateExistingItemById,
    newItems,
    setNewItems,
  } = useContext(TableContext);
  if (children) {
    allItems.current = Children.map(children, child => child)
      ?.filter(child => child.props.rowId !== undefined)
      .map(child => child.props.rowId as T);
  }
  return (
    <div>
      <div className="bg-white border rounded-md border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full table-fixed">
          <tbody>
            {header}
            {newItems.map(id => (
              <TableRowContext.Provider
                key={id}
                value={{
                  kind: 'new',
                  state: 'show',
                  close: () => setNewItems(p => p.filter(v => v !== id)),
                }}
              >
                {creator()}
              </TableRowContext.Provider>
            ))}
            {children
              ? Children.map(children, child => {
                  if (child.props.rowId === undefined) {
                    return child;
                  }
                  const rowInfo =
                    existingItemsMap.get(child.props.rowId) ??
                    DEFAULT_ITEM_VALUE;
                  return (
                    <TableRowContext.Provider
                      value={{
                        kind: 'existing',
                        state: rowInfo.state,
                        isSelected: rowInfo.isSelected,
                        toggleSelect: () =>
                          updateExistingItemById(child.props.rowId, {
                            isSelected: !rowInfo.isSelected,
                          }),
                        markEdited: () =>
                          updateExistingItemById(child.props.rowId, {
                            state: 'edit',
                          }),
                        close: () =>
                          updateExistingItemById(child.props.rowId, {
                            state: 'edit',
                          }),
                      }}
                    >
                      {rowInfo.state === 'edit'
                        ? updater(child.props.rowId)
                        : child}
                    </TableRowContext.Provider>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.SelectRowCheckbox = function TableSelectRowCheckbox() {
  const { isSelected, toggleSelect } = useContext(
    TableRowContext
  ) as TableRowContextExisting;
  return (
    <Table.Data>
      <input type="checkbox" checked={isSelected} onChange={toggleSelect} />
    </Table.Data>
  );
};

Table.EditRowButton = function TableEditRowButton() {
  const { markEdited } = useContext(TableRowContext) as TableRowContextExisting;
  return (
    <Table.Data>
      <button className="p-1 group/edit-btn" onClick={markEdited}>
        <FontAwesomeIcon
          icon={faPenToSquare}
          fixedWidth
          className="text-lg text-blue-500 transition-colors group-hover/edit-btn:text-blue-900 group-hover/edit-btn:scale-110"
        />
      </button>
    </Table.Data>
  );
};

Table.SelectAllRowsCheckbox = function TableSelectAllRowsCheckbox() {
  const {
    areAllItemsSelected,
    selectAllExistingItems,
    deselectAllExistingItems,
  } = useContext(TableContext);

  return (
    <Table.Head>
      <input
        type="checkbox"
        checked={areAllItemsSelected}
        onChange={() => {
          if (areAllItemsSelected) {
            return deselectAllExistingItems();
          }
          selectAllExistingItems();
        }}
      />
    </Table.Head>
  );
};

export type TableRowEditorActionsProps = {
  onSave: AsyncAction;
};

Table.EditorActions = function TableRowEditorActions({
  onSave,
}: TableRowEditorActionsProps) {
  const ctx = useContext(TableRowContext);
  return (
    <Table.Data>
      <button
        className="flex items-center justify-center p-1 group/editor-save shrink-0"
        onClick={async () => {
          await onSave();
          ctx?.close();
        }}
      >
        <FontAwesomeIcon
          icon={faCheck}
          fixedWidth
          className="text-lg text-neutral-600 group-hover/editor-save:text-green-500 group-hover/editor-save:scale-110"
        ></FontAwesomeIcon>
      </button>
      {ctx?.kind === 'existing' ? (
        <button
          className="flex items-center justify-center p-1 group/editor-cancel"
          onClick={ctx?.close}
        >
          <FontAwesomeIcon
            icon={faRotateBack}
            fixedWidth
            className="text-lg text-neutral-600 group-hover/editor-cancel:text-yellow-500 group-hover/editor-cancel:scale-110"
          />
        </button>
      ) : (
        <button
          className="flex items-center justify-center p-1 group/editor-del shrink-0"
          onClick={ctx?.close}
        >
          <FontAwesomeIcon
            icon={faXmark}
            fixedWidth
            className="text-lg text-neutral-600 group-hover/editor-del:text-red-500 group-hover/editor-del:scale-110"
          />
        </button>
      )}
    </Table.Data>
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
          'border-b border-slate-200 dark:border-slate-700 group/row last:border-b-0 rounded-md transition-[background]':
            true,
        }),
        className
      )}
    />
  );
});

Table.DataLoader = function TableDataPlaceholder() {
  return (
    <Table.Data>
      <div className="w-full h-8 rounded-md bg-neutral-200 animate-pulse"></div>
    </Table.Data>
  );
};

Table.Data = forwardRef<HTMLTableCellElement, ComponentPropsWithRef<'td'>>(
  function TableData({ className, children, ...props }, ref) {
    const ctx = useContext(TableRowContext);

    return (
      <td
        className={classNameWithDefaults(
          clsx({
            'text-black dark:text-slate-200 text-sm group-last/row:first:rounded-bl-md group-last:last:rounded-br-md p-0':
              true,
            'bg-slate-100 dark:bg-slate-700':
              ctx?.kind === 'existing' && ctx.isSelected,
          }),
          className
        )}
        {...props}
      >
        <div
          className={clsx({
            'flex items-center h- px-6 overflow-x-auto overflow-y-hidden max-h-0':
              true,
            'animate-table-data-show': ctx?.state === 'show',
            'animate-table-data-edit max-h-12 px-6 py-3': ctx?.state === 'edit',
          })}
        >
          {children}
        </div>
      </td>
    );
  }
);

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return (
    <th className="text-sm text-left first:w-[61px] last:w-[114px] text-slate-900 dark:text-slate-100 font-semibold">
      <div className="flex items-center h-12 px-6 py-3">{children}</div>
    </th>
  );
};

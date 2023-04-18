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

type ItemsMapValue = { isEditing?: boolean; isSelected?: boolean };
type ItemsMap<K extends Id> = Map<K, ItemsMapValue>;

type TableRowEditorContext = {
  close: () => void;
  isExisting: boolean;
};

const TableRowEditorContext = createContext<TableRowEditorContext>(
  undefined as any
);

type TableRowContext = {
  isSelected: boolean;
  toggle: () => void;
  markEdited: () => void;
};

const TableRowContext = createContext<TableRowContext | undefined>(undefined);

type TableContext<T extends Id> = {
  allItems: MutableRefObject<T[]>;

  existingItemsMap: ItemsMap<T>;
  selectedItems: T[];
  areAllItemsSelected: boolean;
  selectAllExistingItems: () => void;
  deselectAllExistingItems: () => void;
  updateExistingItemById: (id: T, data: ItemsMapValue) => void;

  newItems: string[];
  setNewItems: Dispatch<SetStateAction<string[]>>;
};

const TableContext = createContext<TableContext<any>>(undefined as any);

export function Table<T extends Id>({ children }: PropsWithChildren) {
  const allItems = useRef<T[]>([]);

  const [existingItemsMap, setExistingItemsMap] = useState<ItemsMap<T>>(
    new Map()
  );
  const [newItems, setNewItems] = useState<string[]>([]);

  const updateExistingItemById = useCallback((id: T, data: ItemsMapValue) => {
    setExistingItemsMap(prev => {
      const prevValue = prev.get(id);
      return new Map(
        prev.set(id, prevValue ? { ...prevValue, ...data } : data)
      );
    });
  }, []);
  const updateManyItems = useCallback((data: ItemsMapValue) => {
    setExistingItemsMap(prev => {
      [...prev.keys()].map(id => {
        const prevValue = prev.get(id);
        prev.set(id, prevValue ? { ...prevValue, ...data } : data);
      });
      return new Map(prev);
    });
  }, []);
  const selectAllExistingItems = useCallback(() => {
    setExistingItemsMap(prev => {
      allItems.current.forEach(id => {
        const prevValue = prev.get(id);
        const newValue = { isSelected: true };
        prev.set(id, prevValue ? { ...prevValue, ...newValue } : newValue);
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
              <TableRowEditorContext.Provider
                key={id}
                value={{
                  close: () => setNewItems(p => p.filter(v => v !== id)),
                  isExisting: false,
                }}
              >
                {creator()}
              </TableRowEditorContext.Provider>
            ))}
            {children
              ? Children.map(children, child => {
                  if (child.props.rowId === undefined) {
                    return child;
                  }
                  const rowInfo = existingItemsMap.get(child.props.rowId);
                  if (rowInfo?.isEditing) {
                    return (
                      <TableRowEditorContext.Provider
                        value={{
                          close: () =>
                            updateExistingItemById(child.props.rowId, {
                              isEditing: false,
                            }),
                          isExisting: true,
                        }}
                      >
                        {updater(child.props.rowId)}
                      </TableRowEditorContext.Provider>
                    );
                  }
                  return (
                    <TableRowContext.Provider
                      value={{
                        isSelected: !!rowInfo?.isSelected,
                        toggle: () =>
                          updateExistingItemById(child.props.rowId, {
                            isSelected: !rowInfo?.isSelected,
                          }),
                        markEdited: () =>
                          updateExistingItemById(child.props.rowId, {
                            isEditing: true,
                          }),
                      }}
                    >
                      {child}
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
  const { isSelected, toggle } = useContext(TableRowContext)!;
  return (
    <Table.Data>
      <input type="checkbox" checked={isSelected} onChange={toggle} />
    </Table.Data>
  );
};

Table.EditRowButton = function TableEditRowButton() {
  const { markEdited } = useContext(TableRowContext)!;
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
  const { close, isExisting } = useContext(TableRowEditorContext);
  return (
    <Table.Data>
      <button
        className="flex items-center justify-center p-1 group/editor-save shrink-0"
        onClick={async () => {
          await onSave();
          close();
        }}
      >
        <FontAwesomeIcon
          icon={faCheck}
          fixedWidth
          className="text-lg text-neutral-600 group-hover/editor-save:text-green-500 group-hover/editor-save:scale-110"
        ></FontAwesomeIcon>
      </button>
      {isExisting ? (
        <button
          className="flex items-center justify-center p-1 group/editor-cancel"
          onClick={close}
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
          onClick={close}
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
  const ctx = useContext(TableRowContext);

  return (
    <tr
      {...props}
      ref={ref}
      className={classNameWithDefaults(
        clsx({
          'border-b border-slate-200 dark:border-slate-700 group/row last:border-b-0 rounded-md transition-[background]':
            true,
          '[&>td]:bg-slate-100 dark:[&>td]:bg-slate-700': ctx
            ? ctx.isSelected
            : false,
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
    return (
      <td
        className={classNameWithDefaults(
          'text-black dark:text-slate-200 text-sm group-last/row:first:rounded-bl-md group-last:last:rounded-br-md p-0',
          className
        )}
        {...props}
      >
        <div className="flex items-center px-6 overflow-x-auto overflow-y-hidden animate-table-data-show max-h-0">
          {children}
        </div>
      </td>
    );
  }
);

Table.Head = function TableHead({ children }: PropsWithChildren) {
  return (
    <th className="px-6 py-3 text-sm text-left first:w-[61px] last:w-[114px] text-slate-900 dark:text-slate-100 font-semibold">
      <div className="flex items-center">{children}</div>
    </th>
  );
};

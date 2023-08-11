import { useCallback, useState } from 'react';
import { ColumnType } from '../utils/enums'
import { TaskModel } from '../utils/models'
import { swap } from '../helpers/helpers'

const MAX_TASK_PER_COLUMN = 100;

function useColumnTasks(column: ColumnType) {

    const initialState = {
        Todo: [
            { id: 1, title: 'Task 1', column: 'Todo' },
            { id: 2, title: 'Task 2', column: 'Todo' },
        ],
        'In Progress': [
            { id: 3, title: 'Task 3', column: 'In Progress' },
        ],
        Completed: [
            { id: 4, title: 'Task 4', column: 'Completed' },
        ],
    }

    const [tasks, setTasks] = useState<any>(initialState)

    const columnTasks = tasks[column]

    const addEmptyTask = useCallback(() => {
        // console.log(`Adding new empty task to ${column} column`);
        setTasks((allTasks: any) => {
            const columnTasks = allTasks[column];

            if (columnTasks?.length > MAX_TASK_PER_COLUMN) {
                // console.log('Too many task!');
                return allTasks;
            }

            const newColumnTask: TaskModel = {
                id: String(Math.random()),
                title: `New ${column} task`,
                column,
            };

            return {
                ...allTasks,
                [column]: [newColumnTask, ...columnTasks],
            };
        });
    }, [column, setTasks]);

    const deleteTask = useCallback(
        (id: TaskModel['id']) => {
            console.log(`Removing task ${id}..`);
            setTasks((allTasks: any) => {
                const columnTasks = allTasks[column];
                return {
                    ...allTasks,
                    [column]: columnTasks.filter((task: any) => task.id !== id),
                };
            });
        },
        [column, setTasks],
    );

    const updateTask = useCallback(
        (id: TaskModel['id'], updatedTask: Omit<Partial<TaskModel>, 'id'>) => {
            console.log(`Updating task ${id} with ${JSON.stringify(updateTask)}`);
            setTasks((allTasks: any) => {
                const columnTasks = allTasks[column];
                return {
                    ...allTasks,
                    [column]: columnTasks.map((task: any) =>
                        task.id === id ? { ...task, ...updatedTask } : task,
                    ),
                };
            });
        },
        [column, setTasks],
    );

    const dropTaskFrom = useCallback(
        (from: ColumnType, id: TaskModel['id']) => {
            setTasks((allTasks: any) => {
                const fromColumnTasks = allTasks[from];
                const toColumnTasks = allTasks[column];
                const movingTask = fromColumnTasks.find((task: any) => task.id === id);

                console.log(`Moving task ${movingTask?.id} from ${from} to ${column}`);

                if (!movingTask) {
                    return allTasks;
                }

                console.log(fromColumnTasks)

                console.log(typeof id)

                // remove the task from the original column and copy it within the destination column
                return {
                    ...allTasks,
                    // [from]: fromColumnTasks.filter((task: any) => task.id !== id),
                    [from]: fromColumnTasks.filter((task: any) => task.id !== id),
                    [column]: [{ ...movingTask, column }, ...toColumnTasks],
                }
            })
        },
        [column, setTasks],
    );

    const swapTasks = useCallback(
        (i: number, j: number) => {
            // console.log(`Swapping task ${i} with ${j} in ${column} column`)
            setTasks((allTasks: any) => {
                const columnTasks = allTasks[column]
                return {
                    ...allTasks,
                    [column]: swap(columnTasks, i, j),
                }
            })
        },
        [column, setTasks],
    );

    return {
        tasks: columnTasks,
        addEmptyTask,
        updateTask,
        dropTaskFrom,
        deleteTask,
        swapTasks,
    };
}

export default useColumnTasks;
import React, { memo } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { TaskModel } from '../../utils/models';
import { useTaskDragAndDrop } from '../../hooks/useTaskDragAndDrop'
import _ from 'lodash';

type TaskProps = {
    index: number;
    task: TaskModel;
    onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
    onDelete: (id: TaskModel['id']) => void;
    onDropHover: (i: number, j: number) => void;
};

const Task: React.FC<TaskProps> = ({
    index,
    task,
    onUpdate: handleUpdate,
    onDropHover: handleDropHover,
    onDelete: handleDelete,
}) => {
    const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
        { task, index: index },
        handleDropHover,
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        handleUpdate(task.id, { ...task, title: newTitle });
    };

    const handleDeleteClick = () => {
        handleDelete(task.id);
    };

    return (
        <Box
            p={2}
            bg="white"
            borderRadius="md"
            mt={2}
            boxShadow="md"
            ref={ref}
            cursor="grab"
            opacity={isDragging ? 0.5 : 1}
        >
            <Text>{task.title}</Text>
        </Box>
    )
}

export default Task
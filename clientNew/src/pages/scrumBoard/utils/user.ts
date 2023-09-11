import { BoardInfoData, BoardUserInfo } from "../components/boardInfo/comp";

export const isBoardCurrentUser = (userId: string, currentUserId: string | undefined) => {
    return userId === currentUserId;
}

export const isBoardCreator = (creatorId: string, currentUserId: string | undefined) => {
    return creatorId === currentUserId;
}

export const isUserExistsInBoard = (userId: string, boardInfo: BoardInfoData) => {

    const isExists = boardInfo?.users?.some((user: BoardUserInfo) => user?.user._id === userId)

    return isExists;
}
import { BoardInfoData, BoardUserInfo } from "../components/boardInfo/comp";

export const isBoardCurrentUser = (userId: string, currentUserId: string) => {
    return userId === currentUserId;
}

export const isBoardCreator = (creatorId: string, currentUserId: string) => {
    return creatorId === currentUserId;
}

export const isUserExistsInBoard = (userId: string, boardInfo: BoardInfoData) => {

    const isExists = boardInfo?.users?.some((user: BoardUserInfo) => user?.user._id === userId)

    return isExists;
}
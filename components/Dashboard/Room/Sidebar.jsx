import {mediaHandel} from "@functions/mediaHandel";
import {Button, Tooltip} from "@mui/material";
import {userStreamRecoil} from "@recoil/chat";
import {friendsRecoil} from "@recoil/friends";
import {activeRoomsRecoil, roomDetailRecoil} from "@recoil/room";
import {createRoom, joinRoom} from "hook/socketServer";
import {useCallback, useMemo} from "react";
import {MdAdd} from "react-icons/md";
import {useRecoilValue, useSetRecoilState} from "recoil";
import styles from "../dashboard.module.scss";

export default function Sidebar() {
  const activeRooms = useRecoilValue(activeRoomsRecoil);
  const friends = useRecoilValue(friendsRecoil);
  const setRoomDetail = useSetRecoilState(roomDetailRecoil);
  const setStream = useSetRecoilState(userStreamRecoil);

  const showRooms = useMemo(() => {
    let rooms = [];
    if (!activeRooms?.length) return rooms;
    activeRooms.forEach((room) => {
      if (friends.length) {
        friends.forEach((friend) => {
          if (room.creator.userId === friend.id)
            rooms.push({...room, creatorUsername: friend.username});
        });
      }
    });
    return rooms;
  }, [activeRooms, friends]);

  const onJoinClick = useCallback(
    (room) => {
      mediaHandel(setStream, () => {
        joinRoom(room);
        setRoomDetail(room);
      });
    },
    [setRoomDetail, setStream],
  );

  const onCreateClick = useCallback(() => {
    mediaHandel(setStream, () => {
      createRoom();
    });
  }, [setStream]);

  return (
    <div className={styles.sidebar}>
      {showRooms?.map((room) => (
        <Tooltip
          key={room.roomId}
          title={`${room.creatorUsername} room , ${room.participants.length} Connected `}>
          <Button
            color="primary"
            variant="contained"
            className={styles.iconBtn}
            onClick={() => onJoinClick(room)}>
            {room.creatorUsername.slice(0, 2)}
          </Button>
        </Tooltip>
      ))}

      <Tooltip title="Add New Room">
        <Button
          color="primary"
          variant="contained"
          className={styles.iconBtn}
          onClick={onCreateClick}>
          <MdAdd />
        </Button>
      </Tooltip>
    </div>
  );
}

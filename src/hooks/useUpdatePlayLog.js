/** @module useUpdatePlayLog */

import { randomId } from "@mui/x-data-grid-generator";
import _ from "lodash";
import { useSelector } from "react-redux";

const useUpdatePlayLog = () => {
  const username =
    useSelector(state => state.userState?.user?.username) ?? "Unknown User";

  const getPlayLog = guitarObject => {
    const lastPlayed = guitarObject?.lastPlayed;

    const originalPlayLog = _.orderBy(
      (guitarObject?.playLog ?? [])?.map(log => ({
        ...log,
        id: log.id ?? log._id
      })),
      "playDate",
      "desc"
    );

    if (lastPlayed && !originalPlayLog?.length) {
      return [
        {
          playDate: lastPlayed,
          playedBy: username,
          notes: "Legacy 'Last Played'", 
          id: randomId()
        }
      ];
    }
    if (originalPlayLog?.length && lastPlayed) {
      if (originalPlayLog?.some(log => log.playDate === lastPlayed)) {
        return originalPlayLog;
      }
      return [
        {
          playDate: lastPlayed,
          playedBy: username,
          notes: "Legacy 'Last Played'", 
          id: randomId()
        },
        ...originalPlayLog
      ];
    }
    return originalPlayLog;
  };

  return { getPlayLog };
};

export default useUpdatePlayLog;

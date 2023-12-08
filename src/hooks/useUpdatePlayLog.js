/** @module useUpdatePlayLog */

import _ from "lodash";
import moment from "moment";
import { useSelector } from "react-redux";

import { DATE_FORMAT } from "../components/data/constants";

const useUpdatePlayLog = () => {
  const username =
    useSelector(state => state.userState?.user?.username) ?? "Unknown User";

  const getPlayLog = (guitarObject, note) => {
    const lastPlayed = guitarObject?.lastPlayed;

    const originalPlayLog = _.orderBy(
      guitarObject?.playLog ?? [],
      ["playDate"],
      ["desc"]
    );

    const today = moment().format(DATE_FORMAT);

    if (
      originalPlayLog?.some(
        log => log.playDate === today && log.playedBy === username
      )
    ) {
      return guitarObject.playLog;
    }

    const newEntry = {
      playDate: today,
      playedBy: username,
      note
    };

    if (lastPlayed && !originalPlayLog?.length) {
      return [
        newEntry,
        {
          playDate: lastPlayed,
          playedBy: username
        }
      ];
    }
    if (originalPlayLog?.length && lastPlayed) {
      if (originalPlayLog?.some(log => log.playDate === lastPlayed)) {
        return [newEntry, ...guitarObject?.playLog];
      }
      return [
        newEntry,
        {
          playDate: lastPlayed,
          playedBy: username
        },
        ...guitarObject?.playLog
      ];
    }
    return _.orderBy([newEntry, ...originalPlayLog], ["playDate"], ["desc"]);
  };

  return { getPlayLog };
};

export default useUpdatePlayLog;

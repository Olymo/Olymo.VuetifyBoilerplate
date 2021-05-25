import moment from "moment";
var columnSorts = {};

const conversions = {
  date: (val) => moment(val),
  string: (val) => String(val),
  numeric: (val) => (isNaN(val) ? 0 : Number(val)),
  timespan: (val) => {
    const segments = val.split(":");
    const multipliers = {
      d: 86400,
      h: 3600,
      m: 60,
      s: 1,
    };
    let seconds = 0;
    for (const segment of segments) {
      const multiplier = multipliers[segment.slice(-1)];
      const valueToMultiply = segment.substring(
        0,
        segment.indexOf(segment.slice(-1))
      );
      seconds += multiplier * valueToMultiply;
    }

    return seconds;
  },
};

function sort(items, indices, isDesc) {
  items.sort((x, y) => {
    for (let i = 0; i < indices.length; i++) {
      const conv =
        conversions[
          columnSorts[indices[i]] ? columnSorts[indices[i]] : "string"
        ];
      const xVal = conv(x[indices[i]]);
      const yVal = conv(y[indices[i]]);
      if (xVal === yVal) {
        if (i === indices.length - 1) {
          return 0;
        } else {
          continue;
        }
      }

      if (xVal > yVal) {
        return isDesc[i] ? -1 : 1;
      }

      return isDesc[i] ? 1 : -1;
    }
  });
}

export default {
  setSorts(sorts) {
    columnSorts = sorts;
  },
  sort(items, indices, isDesc) {
    for (let i = 0; i < indices.length; i++) {
      sort(items, indices, isDesc);
    }

    return items;
  },
};

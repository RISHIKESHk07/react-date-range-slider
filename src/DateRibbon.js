// import React, { useState, useEffect, useRef } from "react";
// import { format, subDays, addDays } from "date-fns";
// import { useSpring, animated } from "react-spring";
// import { useDrag } from "@use-gesture/react";

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return {
//     day: format(date, "dd"),
//     month: format(date, "MMM"),
//     year: format(date, "yyyy"),
//   };
// };


// const DateRibbon = ({ selectedDates, setSelectedDates, initialDate ,width, dates ,leftMarkerIndex ,rightMarkerIndex}) => {
//   const initialDateStringFormat = format(initialDate, "yyyy-MM-dd");
//   const [leftMarkerDate, setLeftMarkerDate] = useState(dates[leftMarkerIndex]);
//   const [rightMarkerDate, setRightMarkerDate] = useState(dates[rightMarkerIndex]);
//   const scrollAreaRef = useRef(null);
//   const containerRef = useRef(null);
//   const dateWidthRef = useRef(width); // Default width
//   const [leftMarkerPos, setLeftMarkerPos] = useSpring(() => ({
//     left: leftMarkerIndex * dateWidthRef.current,
//   }));
//   const [rightMarkerPos, setRightMarkerPos] = useSpring(() => ({
//     left: (rightMarkerIndex+1) * dateWidthRef.current, // Right marker is on the right side of the date item
//   }));

//   const handleDrop = (marker, newIndex) => {
//     const date = dates[newIndex];
//     if (marker === "left" && newIndex <= dates.indexOf(rightMarkerDate)) {
//       setLeftMarkerDate(date);
//       setLeftMarkerPos({ left: newIndex * dateWidthRef.current });
//     }
//     if (marker === "right" && newIndex >= dates.indexOf(leftMarkerDate)) {
//       setRightMarkerDate(date);
//       setRightMarkerPos({ left: (newIndex + 1) * dateWidthRef.current });
//     }
//   };

//   const bindLeft = useDrag(
//     ({ down, movement: [mx], memo = leftMarkerPos.left.get() }) => {
//       const newLeft = memo + mx;
//       const newIndex = Math.round(newLeft / dateWidthRef.current);
//       if (newIndex >= dates.indexOf(rightMarkerDate)) {
//         const leftPos = dates.indexOf(rightMarkerDate);
//         handleDrop("left", leftPos);
//         setLeftMarkerPos({ left: leftPos * dateWidthRef.current });
//         return memo;
//       }
//       if (!down) handleDrop("left", newIndex);
//       setLeftMarkerPos({ left: newIndex * dateWidthRef.current });
//       return memo;
//     }
//   );

//   const bindRight = useDrag(
//     ({ down, movement: [mx], memo = rightMarkerPos.left.get() }) => {
//       const newLeft = memo + mx;
//       const newIndex = Math.round(newLeft / dateWidthRef.current) - 1;
//       if (newIndex <= dates.indexOf(leftMarkerDate)) {
//         const rightPos = dates.indexOf(leftMarkerDate);
//         handleDrop("right", rightPos);
//         setRightMarkerPos({ left: (rightPos + 1) * dateWidthRef.current });
//         return memo;
//       }
//       if (!down) handleDrop("right", newIndex);
//       setRightMarkerPos({ left: (newIndex + 1) * dateWidthRef.current });
//       return memo;
//     }
//   );

//   const handleClick = (index) => {
//     const leftIndex = dates.indexOf(leftMarkerDate);
//     const rightIndex = dates.indexOf(rightMarkerDate);

//     const leftDistance = Math.abs(index - leftIndex);
//     const rightDistance = Math.abs(index - rightIndex);
//     if (index > leftIndex && index < rightIndex) {
//       if (leftDistance < rightDistance) {
//         setLeftMarkerDate(dates[index]);
//         setLeftMarkerPos({ left: index * dateWidthRef.current });
//       } else {
//         setRightMarkerDate(dates[index]);
//         setRightMarkerPos({ left: (index + 1) * dateWidthRef.current });
//       }
//     } else {
//       if (index < dates.indexOf(leftMarkerDate)) {
//         setLeftMarkerDate(dates[index]);
//         setLeftMarkerPos({ left: index * dateWidthRef.current });
//       } else if (index > dates.indexOf(rightMarkerDate)) {
//         setRightMarkerDate(dates[index]);
//         setRightMarkerPos({ left: (index + 1) * dateWidthRef.current });
//       }
//     }
//   };

//   useEffect(() => {
//     const leftIndex = dates.indexOf(leftMarkerDate);
//     const rightIndex = dates.indexOf(rightMarkerDate);
//     const newSelectedDates = dates.slice(
//       Math.min(leftIndex, rightIndex),
//       Math.max(leftIndex, rightIndex) + 1
//     );
//     setSelectedDates(newSelectedDates);
//   }, [leftMarkerDate, rightMarkerDate]);

//   useEffect(() => {
//     const leftIndex = dates.indexOf(initialDateStringFormat);
//     setLeftMarkerDate(initialDateStringFormat);
//     setLeftMarkerPos({ left: leftIndex * dateWidthRef.current });
//     setRightMarkerDate(initialDateStringFormat);
//     setRightMarkerPos({ left: (leftIndex + 1) * dateWidthRef.current });

//     const initialPosition = (leftIndex + 0.5) * dateWidthRef.current;
//     scrollAreaRef.current.scrollTo({
//       left: initialPosition - scrollAreaRef.current.clientWidth / 2,
//       behavior: "smooth",
//     });
//   }, [initialDate]);

//   useEffect(() => {
//     const leftIndex = dates.indexOf(leftMarkerDate);
//     const rightIndex = dates.indexOf(rightMarkerDate);
//     const initialPosition =
//       (leftIndex + (rightIndex - leftIndex) / 2) * dateWidthRef.current;
//     scrollAreaRef.current.scrollTo({
//       left: initialPosition,
//       behavior: "smooth",
//     });
//   }, []);

//   const getStyle = (index) => {
//     const isBetween =
//       dates.indexOf(leftMarkerDate) <= index &&
//       dates.indexOf(rightMarkerDate) >= index;
//     return {
//       position: "relative",
//       padding: "10px 20px",
//       backgroundColor: isBetween ? "#1c7ed6" : "#f1f3f5",
//       border: `1px solid ${isBetween ? "#1c7ed6" : "#dee2e6"}`,
//       borderRadius: "4px",
//       cursor: "pointer",
//       transition: "background-color 0.3s",
//       textAlign: "center",
//       color: isBetween ? "#fff" : "#000",
//       userSelect: "none", // Prevent text selection while dragging
//     };
//   };

//   return (
//     <div ref={containerRef} style={{ margin: "10px", marginBottom: "20px" }}>
//       <div
//         ref={scrollAreaRef}
//         style={{
//           overflowX: "auto",
//           width: "100%",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             position: "relative",
//             height: "120px",
//           }}
//         >
//           {dates.map((date, index) => {
//             const formattedDate = formatDate(date);
//             return (
//               <div
//                 key={index}
//                 className="date-item"
//                 style={getStyle(index)}
//                 onClick={() => handleClick(index)}
//               >
//                 <div style={{ fontWeight: 500, fontSize: "12px" }}>
//                   {formattedDate.month}
//                 </div>
//                 <div style={{ fontWeight: 900, fontSize: "24px" }}>
//                   {formattedDate.day}
//                 </div>
//                 <div style={{ fontWeight: 500, fontSize: "12px" }}>
//                   {formattedDate.year}
//                 </div>
//               </div>
//             );
//           })}
//           <animated.div
//             {...bindLeft()}
//             style={{
//               ...leftMarkerPos,
//               position: "absolute",
//               top: 0,
//               left: leftMarkerPos.left,
//               width: "10px",
//               height: "120px",
//               background: "#868e96",
//               cursor: "grab",
//               zIndex: 10,
//             }}
//           />
//           <animated.div
//             {...bindRight()}
//             style={{
//               ...rightMarkerPos,
//               position: "absolute",
//               top: 0,
//               left: rightMarkerPos.left,
//               width: "10px",
//               height: "120px",
//               background: "#868e96",
//               cursor: "grab",
//               zIndex: 10,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DateRibbon;


import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import "./App.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: format(date, "dd"),
    month: format(date, "MMM"),
    year: format(date, "yyyy"),
  };
};

const DateRibbon = ({
  selectedDates,
  setSelectedDates,
  width,
  dates,
  leftMarkerIndex,
  rightMarkerIndex,
}) => {
  const [leftMarkerDate, setLeftMarkerDate] = useState(dates[leftMarkerIndex]);
  const [rightMarkerDate, setRightMarkerDate] = useState(dates[rightMarkerIndex]);
  const scrollAreaRef = useRef(null);
  const containerRef = useRef(null);
  const dateWidthRef = useRef(width); // Default width
  const [leftMarkerPos, setLeftMarkerPos] = useSpring(() => ({
    left: leftMarkerIndex * dateWidthRef.current,
  }));
  const [rightMarkerPos, setRightMarkerPos] = useSpring(() => ({
    left: (rightMarkerIndex + 1) * dateWidthRef.current, // Right marker is on the right side of the date item
  }));

  const handleDrop = (marker, newIndex) => {
    const date = dates[newIndex];
    if (marker === "left" && newIndex <= dates.indexOf(rightMarkerDate)) {
      setLeftMarkerDate(date);
      setLeftMarkerPos({ left: newIndex * dateWidthRef.current });
    }
    if (marker === "right" && newIndex >= dates.indexOf(leftMarkerDate)) {
      setRightMarkerDate(date);
      setRightMarkerPos({ left: (newIndex + 1) * dateWidthRef.current });
    }
  };

  const bindLeft = useDrag(
    ({ down, movement: [mx], memo = leftMarkerPos.left.get() }) => {
      const newLeft = memo + mx;
      const newIndex = Math.round(newLeft / dateWidthRef.current);
      if (newIndex >= dates.indexOf(rightMarkerDate)) {
        const leftPos = dates.indexOf(rightMarkerDate);
        handleDrop("left", leftPos);
        setLeftMarkerPos({ left: leftPos * dateWidthRef.current });
        return memo;
      }
      if (!down) handleDrop("left", newIndex);
      setLeftMarkerPos({ left: newIndex * dateWidthRef.current });
      return memo;
    }
  );

  const bindRight = useDrag(
    ({ down, movement: [mx], memo = rightMarkerPos.left.get() }) => {
      const newLeft = memo + mx;
      const newIndex = Math.round(newLeft / dateWidthRef.current) - 1;
      if (newIndex <= dates.indexOf(leftMarkerDate)) {
        const rightPos = dates.indexOf(leftMarkerDate);
        handleDrop("right", rightPos);
        setRightMarkerPos({ left: (rightPos + 1) * dateWidthRef.current });
        return memo;
      }
      if (!down) handleDrop("right", newIndex);
      setRightMarkerPos({ left: (newIndex + 1) * dateWidthRef.current });
      return memo;
    }
  );

  const handleClick = (index) => {
    const leftIndex = dates.indexOf(leftMarkerDate);
    const rightIndex = dates.indexOf(rightMarkerDate);

    const leftDistance = Math.abs(index - leftIndex);
    const rightDistance = Math.abs(index - rightIndex);
    if (index > leftIndex && index < rightIndex) {
      if (leftDistance < rightDistance) {
        setLeftMarkerDate(dates[index]);
        setLeftMarkerPos({ left: index * dateWidthRef.current });
      } else {
        setRightMarkerDate(dates[index]);
        setRightMarkerPos({ left: (index + 1) * dateWidthRef.current });
      }
    } else {
      if (index < dates.indexOf(leftMarkerDate)) {
        setLeftMarkerDate(dates[index]);
        setLeftMarkerPos({ left: index * dateWidthRef.current });
      } else if (index > dates.indexOf(rightMarkerDate)) {
        setRightMarkerDate(dates[index]);
        setRightMarkerPos({ left: (index + 1) * dateWidthRef.current });
      }
    }
  };

  useEffect(() => {
    const leftIndex = dates.indexOf(leftMarkerDate);
    const rightIndex = dates.indexOf(rightMarkerDate);
    const newSelectedDates = dates.slice(
      Math.min(leftIndex, rightIndex),
      Math.max(leftIndex, rightIndex) + 1
    );
    setSelectedDates(newSelectedDates);
  }, [leftMarkerDate, rightMarkerDate]);


  useEffect(() => {
    const leftIndex = dates.indexOf(leftMarkerDate);
    const rightIndex = dates.indexOf(rightMarkerDate);
    const initialPosition =
      (leftIndex + (rightIndex - leftIndex) / 2) * dateWidthRef.current;
    scrollAreaRef.current.scrollTo({
      left: initialPosition,
      behavior: "smooth",
    });
  }, []);

  const getStyle = (index) => {
    const isBetween =
      dates.indexOf(leftMarkerDate) <= index &&
      dates.indexOf(rightMarkerDate) >= index;
    return isBetween ? "date-item between" : "date-item not-between";
  };

  return (
    <div ref={containerRef} className="date-ribbon-container">
      <div ref={scrollAreaRef} className="scroll-area">
        <div className="date-items-container">
          {dates.map((date, index) => {
            const formattedDate = formatDate(date);
            return (
              <div
                key={index}
                className={getStyle(index)}
                onClick={() => handleClick(index)}
              >
                <div className="date-month">{formattedDate.month}</div>
                <div className="date-day">{formattedDate.day}</div>
                <div className="date-year">{formattedDate.year}</div>
              </div>
            );
          })}
          <animated.div {...bindLeft()} style={leftMarkerPos} className="marker-left" />
          <animated.div {...bindRight()} style={rightMarkerPos} className="marker-right" />
        </div>
      </div>
    </div>
  );
};

export default DateRibbon;

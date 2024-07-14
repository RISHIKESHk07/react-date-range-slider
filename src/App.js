import logo from './logo.svg';
import './App.css';
import DateRibbon from './DateRibbon';
import { useState } from 'react';
import { addDays, format, subDays } from 'date-fns';

function App() {
  const [selectedDates,setSelectedDates] =useState([])
  const [initialdate,setInitial]=useState(new Date())
  const generateDates = (daysBefore, daysAfter) => {
    const today = new Date();
    const dates = [];
    for (let i = daysBefore; i > 0; i--) {
      dates.push(format(subDays(today, i), "yyyy-MM-dd"));
    }
    dates.push(format(today, "yyyy-MM-dd"));
    for (let i = 1; i <= daysAfter; i++) {
      dates.push(format(addDays(today, i), "yyyy-MM-dd"));
    }
    return dates;
  };
  return (
    <div className="App">
      <DateRibbon
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        width={69.266}
        dates={generateDates(360,360)}
        leftMarkerIndex={20}
        rightMarkerIndex={23}
        />
    </div>
  );
}

export default App;

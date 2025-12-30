import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

export default function DateRangePicker({ onDateChange }) {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleChange = (update) => {
        setDateRange(update);
        if (update[0] && update[1]) {
            onDateChange(update[0], update[1]);
        }
    };

    const setPreset = (preset) => {
        const today = new Date();
        let start, end;

        switch (preset) {
            case 'today':
                start = new Date(today.setHours(0, 0, 0, 0));
                end = new Date(today.setHours(23, 59, 59, 999));
                break;
            case 'week':
                start = new Date(today);
                start.setDate(today.getDate() - 7);
                end = new Date();
                break;
            case 'month':
                start = new Date(today);
                start.setDate(1);
                end = new Date();
                break;
            case 'all':
                start = null;
                end = null;
                break;
            default:
                return;
        }

        setDateRange([start, end]);
        if (start && end) {
            onDateChange(start, end);
        } else {
            onDateChange(null, null);
        }
    };

    return (
        <div className="date-range-picker">
            <div className="date-picker-container">
                <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleChange}
                    isClearable={true}
                    placeholderText="날짜 범위 선택"
                    dateFormat="yyyy-MM-dd"
                    className="date-input"
                />
            </div>
            <div className="preset-buttons">
                <button onClick={() => setPreset('today')} className="preset-btn">
                    오늘
                </button>
                <button onClick={() => setPreset('week')} className="preset-btn">
                    최근 7일
                </button>
                <button onClick={() => setPreset('month')} className="preset-btn">
                    이번 달
                </button>
                <button onClick={() => setPreset('all')} className="preset-btn">
                    전체
                </button>
            </div>
        </div>
    );
}

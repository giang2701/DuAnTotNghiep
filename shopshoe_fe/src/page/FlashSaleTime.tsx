import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
    endDate: string; // Thời gian kết thúc Flash Sale
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(endDate).getTime() - new Date().getTime();
        let timeLeft = {
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
    ) {
        return <div>Flash Sale đã kết thúc!</div>;
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                color: "white",
                background: "red",
                padding: "15px 8px",
                borderRadius: "5px",
                justifyContent: "space-between",
                marginTop: "10px",
            }}
        >
            <span>Kết thúc sau:</span>
            <div style={{ display: "flex", marginLeft: "5px" }}>
                <div
                    style={{
                        padding: "0 5px",
                        background: "white",
                        color: "black",
                        marginRight: "5px",
                        borderRadius: "3px",
                    }}
                >
                    {String(timeLeft.hours).padStart(2, "0")}
                </div>
                :
                <div
                    style={{
                        padding: "0 5px",
                        background: "white",
                        color: "black",
                        margin: "0 5px",
                        borderRadius: "3px",
                    }}
                >
                    {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                :
                <div
                    style={{
                        padding: "0 5px",
                        background: "white",
                        color: "black",
                        marginLeft: "5px",
                        borderRadius: "3px",
                    }}
                >
                    {String(timeLeft.seconds).padStart(2, "0")}
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;

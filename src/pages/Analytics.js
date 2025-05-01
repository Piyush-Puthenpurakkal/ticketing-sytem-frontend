import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../api/AxiosInstance";
import "../styles/analytics.css";

const data = [
  { week: "Week 1", chats: 15 },
  { week: "Week 2", chats: 10 },
  { week: "Week 3", chats: 14 },
  { week: "Week 4", chats: 9 },
  { week: "Week 5", chats: 5 },
  { week: "Week 6", chats: 13 },
  { week: "Week 7", chats: 4 },
  { week: "Week 8", chats: 9 },
  { week: "Week 9", chats: 17 },
  { week: "Week 10", chats: 19 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">Chats</div>
        <div className="tooltip-value">{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

const CircularProgress = ({ percent }) => {
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="circular-chart">
      <circle
        className="circle-bg"
        stroke="#e2e8f0"
        strokeWidth={stroke}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className="circle"
        stroke="#22c55e"
        strokeWidth={stroke}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="circular-text"
      >
        {percent}%
      </text>
    </svg>
  );
};

export default function Analytics() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    unresolved: 0,
    avgResolution: 0,
  });

  useEffect(() => {
    AxiosInstance.get("/analytics/tickets")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load analytics:", err);
      });
  }, []);

  const averageReply = stats.avgResolution;
  const resolvedPercent =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const totalChats = stats.total;

  return (
    <div className="analytics-content">
      <h2 className="analytics-title">Analytics</h2>

      {/* Missed Chats (unchanged chart) */}
      <section className="section missed-chats">
        <div className="section-header">
          <h3 className="section-title green">Missed Chats</h3>
          <div className="options">…</div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 25]}
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="chats"
              stroke="#22c55e"
              strokeWidth={3}
              dot={(props) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill="#fff"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              )}
              activeDot={(props) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill="#fff"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Average Reply Time */}
      <section className="section reply-time">
        <h3 className="section-title green">Average Reply time</h3>
        <p className="section-description">
          For highest customer satisfaction rates you should aim to reply to an
          incoming customer's message in 15 seconds or less. Quick responses
          will get you more conversations, help you earn customers trust and
          make more sales.
        </p>
        <div className="metric reply">{averageReply} secs</div>
      </section>

      {/* Resolved Tickets */}
      <section className="section resolved-tickets">
        <h3 className="section-title green">Resolved Tickets</h3>
        <p className="section-description">
          A callback system on a website, as well as proactive invitations, help
          to attract even more customers. A separate round button for ordering a
          call with a small animation helps to motivate more customers to make
          calls.
        </p>
        <div className="metric resolved">
          <CircularProgress percent={resolvedPercent} />
        </div>
      </section>

      {/* Total Chats */}
      <section className="section total-chats">
        <h3 className="section-title black">Total Chats</h3>
        <p className="section-description">
          This metric shows the total number of chats for all channels for the
          selected period.
        </p>
        <div className="metric total">{totalChats} Chats</div>
      </section>
    </div>
  );
}

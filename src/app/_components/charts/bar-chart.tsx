import { ResponsiveContainer, BarChart as BC, Bar, YAxis, Tooltip, XAxis } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="panel p-3 !opacity-100">
          <p >{`Rated ${payload[0].payload.name}: ${Math.round(payload[0].value * 10) / 10}`}</p>
        </div>
      );
    }
  
    return null;
  };

export default function BarChart({ data }: any) {
    return (
        <ResponsiveContainer  width="120%" height="100%">
            <BC layout="vertical" data={data}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Bar  dataKey="value" fill="rgb(59 130 246)" />
                <Tooltip cursor={{fill: "rgba(255,255,255,0.05)"}} content={<CustomTooltip />} />
            </BC>
        </ResponsiveContainer>
    )
}
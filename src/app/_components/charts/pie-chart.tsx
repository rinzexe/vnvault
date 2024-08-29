import { Cell, Pie, PieChart as PC, Tooltip, ResponsiveContainer } from "recharts";

let renderLabel = function (entry: any) {
  return entry.name;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="panel p-3 !opacity-100">
        <p >{`${payload[0].name} : ${Math.round(payload[0].value * 10) / 10}`}</p>
      </div>
    );
  }

  return null;
};

export default function PieChart({ data }: any) {

  const COLORS = ['rgb(59 130 246)', 'rgb(37 99 235)', 'rgb(29 78 216)', 'rgb(30 64 175)'];
  return (
    <div className="w-full h-full">
      <ResponsiveContainer className="!absolute" width="100%" height="100%">
        <PC className="!absolute z-10" width={450} height={350} >
          <Pie
            data={data}
            outerRadius={120}
            fill="#000000"
            blendStroke={false}
            stroke={"#000000"}
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell className="opacity-0" key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PC>
      </ResponsiveContainer >
      <ResponsiveContainer width="100%" height="100%">
        <PC className="" width={450} height={350} >
          <Pie
            data={data}
            innerRadius={80}
            outerRadius={100}
            fill="#000000"
            blendStroke={false}
            stroke={"#000000"}
            paddingAngle={4}
            dataKey="value"
            label={renderLabel}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PC>
      </ResponsiveContainer>
    </div>
  );
}


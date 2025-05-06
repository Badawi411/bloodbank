import type React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactElement
  description?: string
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon}
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

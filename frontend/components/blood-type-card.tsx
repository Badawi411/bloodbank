import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface BloodTypeCardProps {
  type: string;
  canDonateTo: string[];
  canReceiveFrom: string[];
}

export default function BloodTypeCard({
  type,
  canDonateTo,
  canReceiveFrom,
}: BloodTypeCardProps) {
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
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          align="center"
          color="primary"
          fontWeight="bold"
        >
          {type}
        </Typography>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Can donate to:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canDonateTo.join(", ")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            Can receive from:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canReceiveFrom.join(", ")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

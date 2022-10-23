import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from 'next/router';

export default function BasicCard(props: {
  id: string;
  title: string;
  desc: string;
  author: string[];
}) {
  const { id, title, desc, author } = props;

  const router = useRouter();

  return (
    <Card
      sx={{
        minWidth: 275,
        height: '100%',

        '&.MuiPaper-root.MuiCard-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <CardContent>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {author.map((i) => i)}
        </Typography>
        <Typography variant="body2">{desc}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            router.push(`/panels/${id}`);
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export function BasicCardSkeleton(props: any) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          <Skeleton height={64} />
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <Skeleton />
        </Typography>
        <Typography variant="body2">
          <Skeleton />
          <Skeleton />
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}

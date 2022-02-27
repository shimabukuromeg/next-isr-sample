import type { NextPage } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useState, useEffect } from 'react';
import {
  Container,
  Text,
  Card,
  Grid,
  Progress,
  Button,
} from '@nextui-org/react';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault('Asia/Tokyo');

const revalidate = 60;
const formatStyle = 'MM/DD HH:mm:ss';

const Home: NextPage<{ createdAt: string; nextCreatedAt: string }> = ({
  createdAt,
  nextCreatedAt,
}) => {
  const [accessTime, setAccessTime] = useState<string>('');
  const [currentDateTime, setCurrentDateTime] = useState(
    dayjs().tz().format(formatStyle)
  );

  const revalidateCount = () => {
    const diff = dayjs(nextCreatedAt).diff(dayjs(currentDateTime), 'seconds');
    if (diff <= 0) {
      return 0;
    }
    return diff;
  };

  const revalidateRate = () => {
    if (revalidateCount() === 0) return 0;
    return (revalidateCount() / revalidate) * 100;
  };

  const ondemandRevalidate = async () => {
    await fetch('api/revalidate')
      .catch((error) => {
        console.error('error', error);
      });
  };

  useEffect(() => {
    setAccessTime(dayjs().tz().format(formatStyle));
    const timer = setInterval(() => {
      setCurrentDateTime(dayjs().tz().format(formatStyle));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container gap={2}>
      <Container css={{ p: 20 }} display="flex" direction="row">
        <Text
          h1
          size={60}
          css={{
            margin: 0,
            textGradient: '45deg, $blue500 -20%, $pink500 50%',
          }}
          weight="bold"
        >
          ISRの
        </Text>
        <Text
          h1
          size={60}
          css={{
            margin: 0,
            textGradient: '45deg, $yellow500 -20%, $red500 100%',
          }}
          weight="bold"
        >
          検証
        </Text>
      </Container>
      <Container gap={2} css={{ mb: 20 }}>
        <Text
          h1
          size={64}
          css={{
            textGradient: '45deg, $blue500 -20%, $pink500 50%',
          }}
          weight="bold"
        >
          {`revalidateに指定してる値：${revalidate}`}
        </Text>
        <Progress value={revalidateRate()} color="gradient" />
      </Container>
      <Container
        display="flex"
        justify="center"
        alignItems="center"
        css={{ h: 60 }}
      >
        <Button shadow color="gradient" size="lg" onClick={ondemandRevalidate}>
          Call Unstable_revalidate API
        </Button>
      </Container>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} sm={12}>
          <Card color="gradient" css={{ h: '$36' }}>
            <Text h6 size={15} color="white" css={{ mt: 0 }}>
              現在時刻
            </Text>
            <Container
              display="flex"
              justify="center"
              alignItems="center"
              css={{ h: '100%' }}
            >
              <Text h1 size={28} color="white">
                {currentDateTime}
              </Text>
            </Container>
          </Card>
        </Grid>
      </Grid.Container>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} sm={6}>
          <Card color="gradient" css={{ h: '$36' }}>
            <Text h6 size={15} color="white" css={{ mt: 0 }}>
              キャッシュされ続ける残りの秒数
            </Text>
            <Container
              display="flex"
              justify="center"
              alignItems="center"
              css={{ h: '100%' }}
            >
              <Text h1 size={28} color="white">
                {revalidateCount().toString()}
              </Text>
            </Container>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card color="gradient" css={{ h: '$36' }}>
            <Text h6 size={15} color="white" css={{ mt: 0 }}>
              このページにアクセスした時刻
            </Text>
            <Container
              display="flex"
              justify="center"
              alignItems="center"
              css={{ h: '100%' }}
            >
              <Text h1 size={28} color="white">
                {accessTime}
              </Text>
            </Container>
          </Card>
        </Grid>
      </Grid.Container>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} sm={6}>
          <Card color="gradient" css={{ h: '$36' }}>
            <Text h6 size={15} color="white" css={{ mt: 0 }}>
              下記の時刻以降にアクセスしたら改めてHTMLが作られる
            </Text>
            <Container
              display="flex"
              justify="center"
              alignItems="center"
              css={{ h: '100%' }}
            >
              <Text h1 size={28} color="white">
                {nextCreatedAt}
              </Text>
            </Container>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card color="gradient" css={{ h: '$36' }}>
            <Text h6 size={20} color="white" css={{ mt: 0 }}>
              いま表示してるHTMLが作られた時刻
            </Text>
            <Container
              display="flex"
              justify="center"
              alignItems="center"
              css={{ h: '100%' }}
            >
              <Text
                h1
                size={40}
                css={{
                  margin: 0,
                  textGradient: '45deg, $yellow500 -20%, $red500 100%',
                }}
              >
                {createdAt}
              </Text>
            </Container>
          </Card>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export async function getStaticProps() {
  const currentTime = dayjs().tz();
  const createdAt = currentTime.format(formatStyle);
  const nextCreatedAt = currentTime.add(revalidate, 's').format(formatStyle);

  return {
    props: {
      createdAt,
      nextCreatedAt,
    },
    revalidate: revalidate,
  };
}

export default Home;

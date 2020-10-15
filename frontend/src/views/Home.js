import React from "react";
import { useParticipants } from '../data/participants';
import Loading from '../components/Loading';

export default function Home(props) {
  const [participants, refetch] = useParticipants();

  return (
    <Loading loads={[participants]}>
      <pre>{JSON.stringify(participants.data, null, 2)}</pre>
    </Loading>
  );
};

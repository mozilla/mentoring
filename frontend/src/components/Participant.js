import React, { Fragment } from "react";

export default function Participant({ participant, onClick }) {
  return (
    <div onClick={onClick}>
      <h3>{participant.full_name}</h3>
    </div>
  );
}

import React, { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import Radio from '@material-ui/core/Radio';
import Participant from '../../components/Participant';

const useStyles = makeStyles(theme => ({
  // participant columns are floated to achieve similar heights
  participantColumn: {
    float: 'left',
    width: '50%',
    padding: theme.spacing(1),
  },
}));

export default function ParticipantColumn({ participants, title, filter, onSelect, selected }) {
  const classes = useStyles();

  return (
    <div className={classes.participantColumn}>
      <h2>{title}</h2>
      {participants.data
        .filter(filter)
        .map(p => (
          <Accordion defaultExpanded key={p.id}>
            <AccordionSummary expandIcon={<ChevronDownIcon />} aria-label="Expand">
							<FormControlLabel
								aria-label="Select"
								onClick={(event) => { event.stopPropagation(); onSelect(p); }}
								onFocus={(event) => event.stopPropagation()}
								control={<Radio checked={Boolean(selected && selected.id === p.id)} />}
								label={p.full_name} />
            </AccordionSummary>
            <AccordionDetails>
              <Participant key={p.id} participant={p} />
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}


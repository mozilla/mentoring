import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import Radio from '@material-ui/core/Radio';
import Participant from '../../components/Participant';
import { participantType } from '../../data/participants';

const useStyles = makeStyles(theme => ({
  // participant columns are floated to achieve similar heights
  participantColumn: {
    float: 'left',
    width: '50%',
    padding: theme.spacing(1),
  },
}));

export default function ParticipantColumn({ participants, title, onSelect, selected }) {
  const classes = useStyles();

  return (
    <div className={classes.participantColumn}>
      <h2>{title}</h2>
      {(participants || [])
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

ParticipantColumn.propTypes = {
  // title for the column
  title: PropTypes.string,

  // the response from useParticipants
  participants: PropTypes.arrayOf(participantType),

  // callback when a participant is selected
  onSelect: PropTypes.func.isRequired,

  // currently selected participant, if any
  selected: PropTypes.object,
};

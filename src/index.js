#!/usr/bin/env node
import axios from 'axios';
import { program } from 'commander';
import { table } from 'table';

const execute = async postcode => {
  const { data } = await axios.get(`https://www.ah.nl/service/rest/delegate?url=%2Fkies-moment%2Fbezorgen%2F${postcode}&_=${Date.now()}`, {
    headers: {
      referrer: `https://www.ah.nl/kies-moment/bezorgen/${postcode}`,
    },
  });

  const dates = data._embedded.lanes[3]._embedded.items[0]._embedded.deliveryDates;

  const availableDatesAndSlots = [];

  dates.forEach(date => {
    if (!date.deliveryTimeSlots.length) return false;
    const availableSlots = date.deliveryTimeSlots.filter(slot => slot.state !== 'full');
    if (!availableSlots.length) return false;

    availableSlots.forEach(slot => {
      availableDatesAndSlots.push({ date: date.date, slot: `From ${slot.from} to ${slot.to}` });
    });
  });
  let tableOutput = [];
  if (availableDatesAndSlots.length) {
    tableOutput = availableDatesAndSlots.map(available => [available.date, available.slot]);
    tableOutput.unshift(['Available dates', ['Available slots']]);
  } else {
    tableOutput.push([`No available slots between ${dates[0].date} and ${dates[dates.length - 1].date} :( `]);
  }
  console.log(table(tableOutput));
};

program
  .command('check <postcode>')
  .description('Check AH delivery')
  .action(postcode => {
    return execute(postcode);
  });

program.parse(process.argv);

#!/usr/bin/env node
import axios from 'axios';
import { program } from 'commander';
import { table } from 'table';
import moment from 'moment';

const execute = async postcode => {
  const { data } = await axios.get(`https://www.ah.nl/service/rest/delegate?url=%2Fkies-moment%2Fbezorgen%2F${postcode}&_=${Date.now()}`, {
    headers: {
      referrer: `https://www.ah.nl/kies-moment/bezorgen/${postcode}`,
    },
  });

  let dates = data._embedded.lanes[3]._embedded.items[0]._embedded.deliveryDates;
  const { cron, limit } = program;

  // filter the results if we have a limit
  if (limit) {
    const daysLimit = parseInt(program.limit, 10);
    if (Number.isNaN(daysLimit) || daysLimit <= 0) throw new Error('Limit must be a number (of days) and it must be > 0');
    const limitDate = moment().add(daysLimit, 'days');
    dates = dates.filter(date => moment(date.date, 'YYYY-MM-DD').isBefore(limitDate));
  }

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
    tableOutput.push([
      `No available slots between ${moment().format('YYYY-MM-DD')} and ${
        limit
          ? moment()
              .add(limit, 'days')
              .format('YYYY-MM-DD')
          : dates[dates.length - 1].date
      } :( `,
    ]);
  }

  console.log(table(tableOutput));

  // exit with error on cron flag
  if (cron && availableDatesAndSlots.length) process.exit(1);
};

program
  .option(
    '-c, --cron',
    "made especially for Synology. You can easily setup Synology to send an email if a cron terminates unexpectedly. The script will terminate with an error if it finds something or with success if it doesn't"
  )
  .option('-l, --limit <number>', 'limits results. Ex. -l 5 will return only results for the next 5 days and discard the rest')
  .command('check <postcode>')
  .description('Check AH delivery')
  .action(postcode => {
    return execute(postcode);
  });

program.parse(process.argv);

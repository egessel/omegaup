#!/usr/bin/python3

'''test verification_code module.'''

import os
import argparse
import logging
import sys
import json
import pytest
import rabbitmq_connection
from pytest_mock import MockerFixture
from producer_coder_of_month import send_message_client
import rabbitmq_client
import pika


sys.path.insert(
    0,
    os.path.join(
        os.path.dirname(os.path.dirname(os.path.realpath(__file__))), '.'))
import lib.db   # pylint: disable=wrong-import-position
import lib.logs  # pylint: disable=wrong-import-position
MESSAGE = {}


def callback(channel: pika.adapters.blocking_connection.BlockingChannel,
             method: pika.spec.Basic.Deliver,
             properties: pika.spec.BasicProperties,
             # pylint: disable=unused-argument,
             body: bytes) -> None:
    '''Callback function to test'''
    global MESSAGE
    MESSAGE = json.loads(body.decode())
    channel.close()


# mypy has conflict with pytest decorations
@pytest.mark.parametrize(
    'params, expected',
    [
        ({'user_id': 1, 'time': '2022-01-26',
          'category': 'all'},
         {'user_id': 1, 'time': '2022-01-26',
          'category': 'all'}),
        ({'user_id': 1, 'time': '2022-01-26',
          'category': 'female'},
         {'user_id': 1, 'time': '2022-01-26',
          'category': 'female'}),
    ],
)  # type: ignore
def test_coder_of_the_month_queue(mocker: MockerFixture,
                                  params, expected) -> None:
    '''Test the message send to the coder of the month queue'''
    mocker.patch('producer_coder_of_month.get_coder_of_the_month',
                 return_value=params)
    parser = argparse.ArgumentParser(description=__doc__)
    lib.db.configure_parser(parser)
    lib.logs.configure_parser(parser)
    rabbitmq_connection.configure_parser(parser)
    args = parser.parse_args()
    lib.logs.init(parser.prog, args)
    logging.info('Started')
    dbconn = lib.db.connect(args)
    try:
        with dbconn.cursor(buffered=True, dictionary=True) as cur, \
            rabbitmq_connection.connect(username='omegaup',
                                        password='omegaup',
                                        host='rabbitmq') as channel:
            send_message_client(cur, channel)
            rabbitmq_client.receive_messages('coder_month',
                                             'certificates',
                                             'CoderOfTheMonthQueue',
                                             channel,
                                             callback)
            assert expected == MESSAGE
    finally:
        dbconn.conn.close()
        logging.info('Done')

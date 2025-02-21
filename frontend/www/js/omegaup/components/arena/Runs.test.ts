jest.mock('../../../../third_party/js/diff_match_patch.js');

import { shallowMount } from '@vue/test-utils';
import { types } from '../../api_types';

import T from '../../lang';

import arena_Runs from './Runs.vue';

describe('Runs.vue', () => {
  it('Should handle empty runs', () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'admin',
        runs: [],
      },
    });

    expect(wrapper.find('.card-header').text()).toBe(T.wordsGlobalSubmissions);
    expect(wrapper.find('table tbody').text()).toBe('');
  });

  it('Should handle runs', async () => {
    const expectedDate = '1/1/2020, 12:00:00 AM';
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'admin',
        runs: [
          {
            alias: 'alias',
            classname: '',
            contest_score: 0,
            country: 'xx',
            guid: '1234',
            language: 'java',
            memory: 1933312,
            penalty: 0,
            run_id: 227,
            runtime: 316,
            score: 0,
            status: 'ready',
            submit_delay: 0,
            time: new Date(expectedDate),
            type: 'normal',
            username: 'username',
            verdict: 'WA',
          },
        ],
        showContest: true,
        showDetails: true,
        showDisqualify: true,
        showPager: true,
        showPoints: false,
        showProblem: true,
        showRejudge: true,
        showUser: true,
        username: null,
      },
    });
    const selectedRun = wrapper.find('td button[data-toggle=popover]');

    expect(selectedRun.attributes('data-content')).toContain(T.verdictWA);
    expect(selectedRun.attributes('data-content')).toContain(T.verdictHelpWA);
  });

  const baseRunData: types.Run = {
    alias: 'alias',
    classname: '',
    contest_score: 0,
    country: 'xx',
    language: 'java',
    memory: 1933312,
    penalty: 0,
    runtime: 316,
    score: 0,
    status: 'ready',
    submit_delay: 0,
    type: 'normal',
    username: 'username',
    verdict: 'WA',
    guid: '119555',
    time: new Date('1/1/2020, 12:30:00 AM'),
  };

  const runs: types.Run[] = [
    {
      ...baseRunData,
      guid: '122000',
      time: new Date('1/1/2020, 12:20:00 AM'),
    },
    {
      ...baseRunData,
      guid: '121000',
      username: 'other_username',
      time: new Date('1/1/2020, 12:10:00 AM'),
    },
    {
      ...baseRunData,
      guid: '120500',
      time: new Date('1/1/2020, 12:05:00 AM'),
    },
    {
      ...baseRunData,
      guid: '120000',
      username: 'other_username',
      time: new Date('1/1/2020, 12:00:00 AM'),
    },
    {
      ...baseRunData,
      guid: '121500',
      time: new Date('1/1/2020, 12:15:00 AM'),
    },
  ];

  it('Should handle order runs', async () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'admin',
        runs,
        showContest: true,
        showDetails: true,
        showDisqualify: true,
        showPager: true,
        showPoints: false,
        showProblem: true,
        showRejudge: true,
        showUser: true,
        username: null,
      },
    });
    expect(
      wrapper.findAll('acronym[data-run-guid]').wrappers.map((e) => e.text()),
    ).toEqual(['122000', '121500', '121000', '120500', '120000']);
  });

  const filtersMapping: { filter: string; value: string }[] = [
    { filter: 'verdict', value: 'AC' },
    { filter: 'status', value: 'new' },
    { filter: 'language', value: 'py3' },
  ];

  describe.each(filtersMapping)(`A filter:`, (filter) => {
    it(`whose name is ${filter.filter} should have gotten the value ${filter.value}`, async () => {
      const wrapper = shallowMount(arena_Runs, {
        propsData: {
          contestAlias: 'admin',
          runs,
          showPager: true,
        },
      });
      await wrapper
        .find(`select[data-select-${filter.filter}]`)
        .find(`option[value="${filter.value}"]`)
        .setSelected();

      expect(wrapper.emitted('filter-changed')).toEqual([[filter]]);
    });
  });

  it('Should handle change page control', async () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'contest',
        runs,
        showPager: true,
        rowCount: 2,
      },
    });

    expect(
      wrapper.find('button[data-button-page-previous]').attributes('disabled'),
    ).toBeTruthy();
    expect(
      wrapper.find('button[data-button-page-next]').attributes('disabled'),
    ).toBeFalsy();
    expect(wrapper.find('.pager-controls').text()).toContain('1');
    await wrapper.find('button[data-button-page-next]').trigger('click');

    expect(wrapper.emitted('filter-changed')).toEqual([
      [{ filter: 'offset', value: '1' }],
    ]);

    expect(
      wrapper.find('button[data-button-page-previous]').attributes('disabled'),
    ).toBeFalsy();
    expect(
      wrapper.find('button[data-button-page-next]').attributes('disabled'),
    ).toBeFalsy();
    expect(wrapper.find('.pager-controls').text()).toContain('2');
  });

  it('Should handle username filter', async () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'contest',
        runs,
        showPager: true,
        showUser: true,
      },
    });

    await wrapper.setData({ filterUsername: 'other_username' });
    expect(wrapper.emitted('filter-changed')).toEqual([
      [{ filter: 'username', value: 'other_username' }],
    ]);
  });

  it('Should handle problem filter', async () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        contestAlias: 'contest',
        runs,
        showPager: true,
        showProblem: true,
      },
    });

    await wrapper.setData({ filterProblem: 'other_problem' });
    expect(wrapper.emitted('filter-changed')).toEqual([
      [{ filter: 'problem', value: 'other_problem' }],
    ]);
  });

  it('Should handle the new submission button', async () => {
    const wrapper = shallowMount(arena_Runs, {
      propsData: {
        problemAlias: 'alias',
        runs,
        showDetails: true,
        isContestFinished: false,
        useNewSubmissionButton: true,
      },
    });

    expect(wrapper.find('tfoot button').text()).toBe(T.wordsNewSubmissions);
  });
});

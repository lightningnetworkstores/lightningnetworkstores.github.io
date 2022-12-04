<template>
    <v-container class="d-flex justify-center flex-column mt-9">
        <div>
            <h2>Investor Information</h2>
            <v-row justify="space-between" align="center">
                <v-col md="4">
                    <v-switch
                        v-model="switchChart"
                        inset
                        :label="`${switchChart ? 'Sats' : 'USD'}`"
                    ></v-switch>
                </v-col>

                <v-col md="4">
                    <v-select
                        v-model="changeSelectGroupBy"
                        :items="items"
                        class="mt-4"
                        label="Group by"
                        dense
                        outlined
                        full-width
                    ></v-select>
                </v-col>
            </v-row>
            <GChart type="ColumnChart" :options="options" :data="chartData" />
        </div>
        <div style="text-align: center">
          <br>
          <br>
          <label> AUM: {{(aum).toLocaleString()}}</label>
          <br>
          <label> Balance: {{balance.toLocaleString()}}</label>
          <br>
          <label> Faucet liabilities: {{faucet_liabilities.toLocaleString()}}</label>
          <br>
          <label> User liabilities: {{user_liabilities.toLocaleString()}}</label>
        </div>
        <div style="text-align: center">
          <br>
          <label> Total users: {{user_stats.total}}</label>
          <br>
          <label> Voters: {{user_stats.voters}}</label>
          <br>
          <label> Weekly growth (%): {{user_stats.week_growth}}</label>
          <br>
          <label> Monthly growth (%): {{user_stats.month_growth}}</label>
          <br>
          <label> Quarterly growth (%): {{user_stats.quarter_growth}}</label>
        </div>
    </v-container>
</template>

<script>
import { GChart } from 'vue-google-charts'
import { getWeeks } from '../utils/getWeeks'
import { getQuarterly } from "../utils/getQuarterly"

export default {
    data() {
        return {
            switchChart: false,
            changeDate: 1,
            chartDataHeaderWeeks: ['Month', 'USD'],
            chartDataRows: [],
            options: {
                width: '100%',
                height: 500,
                colors: ['#3c3d3c'],
                legend: { position: 'bottom' },
            },
            items: ['Month', 'Weekly', 'Quarterly'],
            arrChartTemp: [],
            daily_revenue: [],
            aum: 0,
            faucet_liabilities: 0,
            user_liabilities: 0,
            balance: 0,
            sats_per_usd: 1200,
            user_stats: {}
        }
    },

    components: {
        GChart,
    },

    watch: {
        switchChart(newSwitchChart, _) {
            let value = newSwitchChart ? 1 : 2
            let strValue = newSwitchChart ? 'Sats' : 'USD'

            this.chartDataRows = this.arrChartTemp.map((s) => {
                return [s[0], s[value]]
            })

            this.chartDataHeaderWeeks = ['Month', strValue]
            if(value == 1){
              this.aum = Math.round(this.aum*this.sats_per_usd)
              this.balance = Math.round(this.balance*this.sats_per_usd)
              this.user_liabilities = Math.round(this.user_liabilities*this.sats_per_usd)
              this.faucet_liabilities = Math.round(this.faucet_liabilities*this.sats_per_usd)
            } else {
              this.aum = Math.round(10*this.aum/this.sats_per_usd)/10
              this.balance = Math.round(10*this.balance/this.sats_per_usd)/10
              this.user_liabilities = Math.round(10*this.user_liabilities/this.sats_per_usd)/10
              this.faucet_liabilities = Math.round(10*this.faucet_liabilities/this.sats_per_usd)/10
            }
        },
    },

    computed: {
        chartData() {
            // Rango de fecha semanal
            return [this.chartDataHeaderWeeks, ...this.chartDataRows]
        },
        changeSelectGroupBy: {
            get() {
                return 'Month'
            },
            set(value) {
                if (value == 'Month') {
                    this.fnDataMonth()
                    this.options = {
                        width: '100%',
                        height: 500,
                        colors: ['#3c3d3c'],
                        legend: { position: 'bottom' },
                    }
                }

                if (value == 'Weekly') {
                    this.fnDataWeek()
                    this.options = {
                        width: '100%',
                        height: 500,
                        colors: ['#3c3d3c'],
                        legend: { position: 'bottom' },
                        hAxis: {
                            slantedText: true,
                            slantedTextAngle: 45,
                        },
                    }
                }

                if (value == "Quarterly") {
                    this.fnDataQuarterly()
                    this.options = {
                        width: '100%',
                        height: 500,
                        colors: ['#3c3d3c'],
                        legend: { position: 'bottom' },
                    }
                }
            },
        },
    },

    methods: {
        /**
         * @param {Date} date
         * @param {Boolean} withoutMonth
         */
        getMonth(date, withoutMonth = false) {
            if (withoutMonth) {
                return new Date(date).toLocaleString('en', {
                    year: 'numeric',
                })
            }

            return new Date(date).toLocaleString('en', {
                month: 'long',
                year: 'numeric',
            })
        },
        /**
         * @param {any[]} daily_revenue
         */
        fnDataMonth() {
            // Get first weeks
            const objMonth = {}

            this.daily_revenue.forEach((month) => {
                const nDate = this.getMonth(month.date)

                objMonth[nDate] = [
                    ...(objMonth[nDate] ?? []),
                    {
                        sum_satoshis: month.sat_revenue,
                        sum_dollar: month.dollar_revenue,
                    },
                ]
            })

            const numMonth = Object.keys(objMonth)
            // Now from the months, we take out the sum of the values
            const months = numMonth.map((month, index) => {
                const sum_satoshis = this.notNaN(
                    [...objMonth[month]].reduce(
                        (acc, curr) => acc + curr.sum_satoshis,
                        0
                    )
                )

                const sum_dollar = this.notNaN(
                    [...objMonth[month]].reduce(
                        (acc, curr) => acc + curr.sum_dollar,
                        0
                    )
                )

                return [numMonth[index], sum_satoshis, sum_dollar]
            })

            this.arrChartTemp = months

            let value = this.switchChart ? 1 : 2
            this.chartDataRows = this.arrChartTemp.map((s) => {
                return [s[0], s[value]]
            })
        },
        /**
         * @param {number} value
         */
        notNaN(value) {
            if (Number.isNaN(value)) {
                return 0
            }

            return value
        },
        /**
         * @param {any[]} daily_revenue
         */
        fnDataWeek() {
            // We get the number of weeks compared to the days
            const objWeeks = {}

            this.daily_revenue.forEach((revenue) => {
                let numWeeks = getWeeks(revenue.date)
                let nDate = this.getMonth(revenue.date, true)
                let weeks_year = `${nDate}-${numWeeks}`

                objWeeks[weeks_year] = [
                    ...(objWeeks[weeks_year] ?? []),
                    revenue,
                ]
            })

            const numWeeks = Object.keys(objWeeks)
            const weeks = numWeeks.map((num) => {
                const sum_satoshis = this.notNaN(
                    [...objWeeks[num]].reduce(
                        (acc, curr) => acc + curr.sat_revenue,
                        0
                    )
                )
                const sum_dollar = this.notNaN(
                    [...objWeeks[num]].reduce(
                        (acc, curr) => acc + curr.dollar_revenue,
                        0
                    )
                )

                return [num, sum_satoshis, sum_dollar]
            })

            this.arrChartTemp = weeks

            let value = this.switchChart ? 1 : 2
            this.chartDataRows = this.arrChartTemp.map((s) => {
                return [s[0], s[value]]
            })
        },
        /**
         * @param {any[]} daily_revenue
         */
        fnDataQuarterly() {
            const objQuarterly = {}

            this.daily_revenue.forEach((revenue) => {
                let numQuarter = getQuarterly(revenue.date)
                let nDate = this.getMonth(revenue.date, true)
                let nameQuarter = `${nDate}-Q${numQuarter}`

                objQuarterly[nameQuarter] = [
                    ...(objQuarterly[nameQuarter] ?? []),
                    revenue,
                ]
            })

            const keyQuarter = Object.keys(objQuarterly)
            const quarters = keyQuarter.map((num) => {
                const sum_satoshis = this.notNaN(
                    [...objQuarterly[num]].reduce(
                        (acc, curr) => acc + curr.sat_revenue,
                        0
                    )
                )
                const sum_dollar = this.notNaN(
                    [...objQuarterly[num]].reduce(
                        (acc, curr) => acc + curr.dollar_revenue,
                        0
                    )
                )

                return [num, sum_satoshis, sum_dollar]
            })

            this.arrChartTemp = quarters

            let value = this.switchChart ? 1 : 2
            this.chartDataRows = this.arrChartTemp.map((s) => {
                return [s[0], s[value]]
            })
        },
    },

    async mounted() {
        const dataApi = await this.$axios.get('/api/investorinfo')

        if (dataApi.status === 200) {
            const analyzeData = dataApi.data.data
            this.daily_revenue = analyzeData.daily_revenue

            this.fnDataMonth()

            this.sats_per_usd = 100000000/analyzeData.daily_revenue[analyzeData.daily_revenue.length-1].btcusd

            this.aum = Math.round(10*analyzeData.balance_sheet.AUM/this.sats_per_usd)/10
            this.balance = Math.round(10*analyzeData.balance_sheet.account_balance/this.sats_per_usd)/10
            this.user_liabilities = Math.round(10*analyzeData.balance_sheet.user_liabilities/this.sats_per_usd)/10
            this.faucet_liabilities = Math.round(10*analyzeData.balance_sheet.faucet_liabilities/this.sats_per_usd)/10
            this.user_stats = analyzeData.users
        }
    },
}
</script>
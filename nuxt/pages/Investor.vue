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
    </v-container>
</template>

<script>
import { GChart } from 'vue-google-charts'
import { getWeeks } from '../utils/getWeeks'
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
            items: ['Month', 'Weekly'],
            arrChartTemp: [],
            daily_revenue: [],
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
    },

    async mounted() {
        const dataApi = await this.$axios.get('/api/investorinfo')

        if (dataApi.status === 200) {
            const analyzeData = dataApi.data.data

            this.daily_revenue = analyzeData.daily_revenue
            this.fnDataMonth()
        }
    },
}
</script>
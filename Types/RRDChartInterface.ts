export type RRDChartInterface = ChartData[]

export interface ChartData {
  time: number
  maxdisk?: number
  disk?: number
  maxmem?: number
  maxcpu?: number
  netout?: number
  diskwrite?: number
  mem?: number
  diskread?: number
  netin?: number
  cpu?: number
}

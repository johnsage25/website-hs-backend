export interface ProVmStatusInterface {
  ha: Ha;
  "running-machine": string;
  mem?: any;
  cpu: number;
  cpus: number;
  status: string;
  "proxmox-support": ProxmoxSupport;
  maxdisk: number;
  ballooninfo: Ballooninfo;
  diskread: number;
  "running-qemu": string;
  vmid: number;
  name: string;
  maxmem: number;
  qmpstatus: string;
  netin: number;
  nics: Nics;
  blockstat: Blockstat;
  serial: number;
  uptime: any;
  freemem: number;
  balloon: number;
  pid: number;
  disk: number;
  diskwrite: number;
  netout: number;
}

export interface Ha {
  managed: number;
}

export interface ProxmoxSupport {
  "pbs-dirty-bitmap-migration": boolean;
  "query-bitmap-info": boolean;
  "pbs-dirty-bitmap": boolean;
  "pbs-library-version": string;
  "pbs-dirty-bitmap-savevm": boolean;
  "pbs-masterkey": boolean;
}

export interface Ballooninfo {
  max_mem: number;
  actual: number;
  last_update: number;
  major_page_faults: number;
  free_mem: number;
  total_mem: number;
  mem_swapped_in: number;
  minor_page_faults: number;
  mem_swapped_out: number;
}

export interface Nics {
  tap999842910i0: Tap999842910i0;
}

export interface Tap999842910i0 {
  netin: number;
  netout: number;
}

export interface Blockstat {
  scsi0: Scsi0;
  ide2: Ide2;
}

export interface Scsi0 {
  idle_time_ns: number;
  invalid_rd_operations: number;
  flush_total_time_ns: number;
  invalid_flush_operations: number;
  wr_highest_offset: number;
  failed_rd_operations: number;
  rd_bytes: number;
  wr_bytes: number;
  invalid_wr_operations: number;
  failed_wr_operations: number;
  timed_stats: any[];
  unmap_total_time_ns: number;
  unmap_bytes: number;
  flush_operations: number;
  invalid_unmap_operations: number;
  rd_operations: number;
  account_failed: boolean;
  rd_total_time_ns: number;
  failed_flush_operations: number;
  wr_merged: number;
  wr_total_time_ns: number;
  failed_unmap_operations: number;
  unmap_merged: number;
  rd_merged: number;
  account_invalid: boolean;
  unmap_operations: number;
  wr_operations: number;
}

export interface Ide2 {
  failed_unmap_operations: number;
  unmap_merged: number;
  rd_merged: number;
  wr_total_time_ns: number;
  wr_operations: number;
  account_invalid: boolean;
  unmap_operations: number;
  invalid_unmap_operations: number;
  rd_operations: number;
  unmap_bytes: number;
  flush_operations: number;
  wr_merged: number;
  account_failed: boolean;
  failed_flush_operations: number;
  rd_total_time_ns: number;
  wr_bytes: number;
  invalid_wr_operations: number;
  failed_wr_operations: number;
  unmap_total_time_ns: number;
  timed_stats: any[];
  invalid_rd_operations: number;
  flush_total_time_ns: number;
  invalid_flush_operations: number;
  idle_time_ns: number;
  rd_bytes: number;
  failed_rd_operations: number;
  wr_highest_offset: number;
}

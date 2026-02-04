/* eslint sort-keys: "error" */
export default {
  actions: {
    backup: 'Backup',
    backupSelected: 'Backup reports',
    cancel: 'Cancel',
    createReference: 'Create reference',
    delete: 'Delete',
    deleteSelected: 'Delete reports',
    open: 'Open',
    showReport: 'Show report',
    startSelectedTest: 'Start selected test',
    startTest: 'Start test'
  },
  breadcrumbs: {
    home: 'Home'
  },
  controlPanel: {
    columns: {
      name: 'Test name'
    },
    diskUsage: {
      backups: 'Backups:',
      capacity: 'Capacity:',
      description: '{used} mb',
      references: 'References:',
      reports: 'Tests:',
      title: 'Disk space usage',
      used: 'Used:'
    },
    reference: {
      page: 'References page',
      title: 'References'
    },
    test: {
      title: 'Start new test'
    }
  },
  envs: {
    columns: {
      name: 'Environment name'
    }
  },
  global: {
    appName: 'ToledoDashboard',
    filter: 'Filter by name',
    title: 'Toledo Dashboard'
  },
  home: {
    card: {
      title: 'Frontera'
    }
  },
  login: {
    providers: {
      dev: 'Developer mode',
      github: 'Continue with GitHub',
      google: 'Continue with Google'
    },
    title: 'Sign in'
  },
  menu: {
    appearance: 'Appearance',
    github: 'GitHub repository',
    neutral: 'Neutral',
    primary: 'Primary',
    secondary: 'Secondary',
    theme: 'Theme'
  },
  modal: {
    backup: {
      description:
        'Are you sure you want to backup the report? | Are you sure you want to backup the selected reports?',
      title: 'Backup report | Backup reports'
    },
    delete: {
      description:
        'Are you sure you want to delete the report? | Are you sure you want to delete the selected reports?',
      title: 'Delete report | Delete reports'
    }
  },
  mode: {
    dark: 'Dark',
    light: 'Light',
    system: 'System'
  },
  navigation: {
    envs: 'Environments',
    panel: 'Control panel',
    references: 'References',
    reports: 'Reports'
  },
  notifications: {
    references: {
      start: 'Creation of references has started'
    },
    report: {
      backup: 'Report has been backed up | Reports have been backed up',
      delete: 'Report has been deleted | Reports have been deleted'
    },
    tests: {
      start: 'Testing started',
      startSelected: 'Testing of selected tests has started'
    }
  },
  reports: {
    columns: {
      name: 'Report name',
      result: 'Result',
      status: 'Status'
    },
    status: {
      failed: 'Failed',
      passed: 'Passed',
      pending: 'Pending'
    }
  },
  user: {
    logout: 'Logout'
  }
}

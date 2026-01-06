/* eslint sort-keys: "error" */
export default {
  actions: {
    backup: 'Backup',
    backupSelected: 'Backup reports',
    createReference: 'Create reference',
    delete: 'Delete',
    deleteSelected: 'Delete reports',
    jira: 'Jira Ticket',
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
      description: '{label} {used} mb / {total} mb',
      reference: 'References:',
      test: 'Tests:',
      title: 'Disk space usage'
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
  mode: {
    dark: 'Dark',
    light: 'Light',
    system: 'System'
  },
  navigation: {
    envs: 'Environments',
    panel: 'Control panel',
    reports: 'Reports'
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

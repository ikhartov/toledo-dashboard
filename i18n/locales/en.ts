/* eslint sort-keys: "error" */
export default {
  actions: {
    backup: 'Backup',
    backupSelected: 'Backup reports',
    delete: 'Delete',
    deleteSelected: 'Delete reports',
    jira: 'Jira Ticket',
    open: 'Open',
    showReport: 'Show report',
    startTest: 'Start test'
  },
  breadcrumbs: {
    home: 'Home'
  },
  envs: {
    columns: {
      name: 'Environment name'
    }
  },
  global: {
    appName: 'ToledoDashboard',
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
    filter: 'Filter by name',
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

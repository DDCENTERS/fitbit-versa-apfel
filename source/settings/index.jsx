function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">color theme</Text>}>
        <Toggle
          settingsKey="colorToggle"
          label="Custom color theme"
        />
        <ColorSelect
          settingsKey="customColor"
          colors={[
            {color: "#fa114f"},
            {color: "#ff3b30"},
            {color: "#ff9500"},
            {color: "#ffe620"},
            {color: "#04de71"},
            {color: "#00f5ea"},
            {color: "#5ac8fa"},
            {color: "#2094fa"},
            {color: "#787aff"}
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">weather settings</Text>}>
        <TextInput
          label="API key"
          placeholder="register on 'openweathermap.org/appid'"
          settingsKey="apiKey"
        />
        <Toggle
          settingsKey="weatherToggle"
          label="Custom city instead of gps"
        />
        <TextInput
          label="City"
          placeholder="e.g. zurich,ch"
          settingsKey="customCity"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);

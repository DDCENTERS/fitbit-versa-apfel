function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">color theme</Text>}>
        <Toggle
          settingsKey="colorToggle"
          label="custom color theme"
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
        title={<Text bold align="center">activity settings</Text>}>
        <Select
          settingsKey="topActivity"
          label="top activity"
          selectViewTitle="choose top activity"
          options={[
            {name:"steps"},
            {name:"calories"},
            {name:"distance"},
            {name:"activemin"},
            {name:"elevation"}
          ]}
        />
        <Select
          settingsKey="middleActivity"
          label="middle activity"
          selectViewTitle="choose middle activity"
          options={[
            {name:"steps"},
            {name:"calories"},
            {name:"distance"},
            {name:"activemin"},
            {name:"elevation"}
          ]}
        />
        <Select
          settingsKey="bottomActivity"
          label="bottom activity"
          selectViewTitle="choose bottom activity"
          options={[
            {name:"steps"},
            {name:"calories"},
            {name:"distance"},
            {name:"activemin"},
            {name:"elevation"}
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">weather settings</Text>}>
        <Toggle
          settingsKey="weatherToggle"
          label="weather widget"
        />
        <TextInput
          settingsKey="apiKey"
          label="API key"
          placeholder="register on 'openweathermap.org/appid'"
          disabled={!(props.settings.weatherToggle === "true")}
        />
        <Toggle
          settingsKey="locationToggle"
          label="static location (no GPS)"
        />
        <TextInput
          settingsKey="customCity"
          label="city"
          placeholder="e.g. zurich,ch"
          disabled={!(props.settings.locationToggle === "true")}
        />
      </Section>
      <Link source="https://github.com/sw1ft-code/fitbit-versa-apfel/blob/master/README.md">made by sw1ft-code</Link>
      {/* TROUBLESHOOT - RESET SETTINGS
      <Button
        list
        label="reset settings to default"
        onClick={() => props.settingsStorage.clear()}
      />
      */}
    </Page>
  );
}

registerSettingsPage(mySettings);

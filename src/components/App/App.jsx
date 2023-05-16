import React, { Component } from 'react';
import { ContactForm } from '../ContactForm/ContactForm';
import { Filter } from '../Filter/Filter';
import { ContactList } from '../ContactList/ContactList';
import { nanoid } from 'nanoid';
import { Container, Title, Subtitle } from './App.styled';

const KEY_CONTACTS = 'contacts';

const INITIAL_STATE = {
  contacts: [],
  filter: '',
};

export class App extends Component {
  state = { ...INITIAL_STATE };

  componentDidMount() {
    if (localStorage.getItem(KEY_CONTACTS)) {
      this.setState(prevState => ({
        contacts: JSON.parse(localStorage.getItem(KEY_CONTACTS)),
      }));
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts.length !== contacts.length) {
      localStorage.setItem(KEY_CONTACTS, JSON.stringify(contacts));
    }
  }

  addContact = ({ name, number }) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };

    if (
      this.state.contacts.find(
        item => item.name.toLowerCase() === contact.name.toLowerCase()
      )
    ) {
      alert(`${contact.name} is already in contacts.`);
      return;
    }

    this.setState(prevstate => ({
      contacts: [contact, ...prevstate.contacts],
    }));
  };

  getFiltredContacts = () => {
    const normalizedFilter = this.state.filter.toLowerCase();

    return this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  handleFilterChange = evt => {
    this.setState({ filter: evt.currentTarget.value });
  };

  handleDeleteContact = contactId => {
    this.setState({
      contacts: this.state.contacts.filter(item => item.id !== contactId),
    });
  };

  render() {
    const { filter } = this.state;

    const filtredContacts = this.getFiltredContacts();

    return (
      <Container>
        <Title>Phonebook</Title>
        <ContactForm onSubmit={this.addContact} />
        <Subtitle>Contacts</Subtitle>
        <Filter value={filter} onChange={this.handleFilterChange} />
        <ContactList
          contacts={filtredContacts}
          onDeleteContact={this.handleDeleteContact}
        />
      </Container>
    );
  }
}

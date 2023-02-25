@isTest
private class ContactControllerTest {
   @testSetup
   private static void setupData() {
      List<Contact> contacts = new List<Contact>();
      for (Integer i = 0; i < 20; i++) {
         contacts.add(new Contact(LastName = 'TestContact' + i));
      }
      insert contacts;
   }

   @isTest
   private static void getContacts_wireContacts_contactsReceived() {
      List<Contact> receivedContacts = [SELECT Id, Name FROM Contact];

         Test.startTest();
         List<Contact> contacts = ContactController.getContacts();
         Test.stopTest();

         System.assertEquals(receivedContacts, contacts, 'Contacts wasnt received');
   }

   @isTest
   private static void getContacts_wireContacts_errorThrown() {
      List<Contact> allContacts = [SELECT Id FROM Contact];
      delete allContacts;
      
      Test.startTest();
      Boolean isException = false;
      try {
         ContactController.getContacts();
      } catch (Exception e) {
         if (e.getMessage().contains('Contacts are empty')) {
            isException = true;
         }
      }
      Test.stopTest();

      System.assert(isException, 'Contact should have thrown an exception');
   }
}
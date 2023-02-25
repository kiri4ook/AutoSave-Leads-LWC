@isTest
private class LeadControllerTest {
   @testSetup
   private static void setupData() {
      List<Lead> leads = new List<Lead>();
      for (Integer i = 0; i < 20; i++) {
         leads.add(new Lead(LastName = 'TestLead' + i));
      }
      insert leads;
   }

   @isTest
   private static void getLeads_wireLeads_leadsReceived() {
      List<Lead> receivedLeads = [SELECT Id, Name FROM Lead];

         Test.startTest();
         List<Lead> leads = LeadController.getLeads();
         Test.stopTest();

         System.assertEquals(receivedLeads, leads, 'Leads wasnt received');
   }

   @isTest
   private static void getLeads_wireLeads_errorThrown() {
      List<Lead> allLeads = [SELECT Id FROM Lead];
      delete allLeads;
      
      Test.startTest();
      Boolean isException = false;
      try {
         LeadController.getLeads();
      } catch (Exception e) {
         if (e.getMessage().contains('Leads are empty')) {
            isException = true;
         }
      }
      Test.stopTest();

      System.assert(isException, 'Lead should have thrown an exception');
   }
}
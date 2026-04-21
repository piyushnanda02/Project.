package com.vendor.testcases;

import org.testng.annotations.Test;
import org.testng.Assert;

public class SimpleTest {
    
    @Test
    public void testPass() {
        Assert.assertTrue(true);
        System.out.println("Test passed successfully!");
    }
    
    @Test
    public void testMessage() {
        String message = "Hello Automation";
        Assert.assertEquals(message, "Hello Automation");
        System.out.println("Message test passed!");
    }
}

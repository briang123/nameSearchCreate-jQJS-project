Imports System.Web.SessionState
Imports BG.Web.NameSearch.Common.BGCommon

Public Class Global_asax
	Inherits System.Web.HttpApplication
	Public HttpContext As HttpContext
	
	Private Shared NamesearchCacheTimer As System.Threading.Timer
	Private NamesearchCacheTimerInterval As Integer = 60000 * 10
	
	Sub SetNamesearchCache(ByVal sender As Object)
    	Try
        	Dim NamesearchResultsProvider As New BG.Web.NameSearch.Query.Data.Models.ResultsDataProvider()
        	NamesearchResultsProvider.CacheNamesearchData("TheSystemNameHere", NamesearchCacheTimerInterval + (60000 * 5), CType(sender, HttpContext))
    	Catch ex As Exception
        	CatchException("NameSearch", "Global_asax", "Application_Start", "Sender", ex.StackTrace, Nothing, ex)
    	End Try
	End Sub
	
	Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires when the application is started
    	Try
        	If (NamesearchCacheTimer Is Nothing) Then
            	NamesearchCacheTimer = New System.Threading.Timer(New System.Threading.TimerCallback(AddressOf SetNamesearchCache), HttpContext.Current, 10000, NamesearchCacheTimerInterval)
        	End If
    	Catch ex As Exception
        	CatchException("NameSearch", "Global_asax", "Application_Start", "Sender", ex.StackTrace, Nothing, ex)
    	End Try
	End Sub
	
	Sub Session_Start(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires when the session is started
	End Sub
	
	Sub Application_BeginRequest(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires at the beginning of each request
	End Sub
	
	Sub Application_AuthenticateRequest(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires upon attempting to authenticate the use
	End Sub
	
	Sub Application_Error(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires when an error occurs
	End Sub
	
	Sub Session_End(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires when the session ends
	End Sub
	
	Sub Application_End(ByVal sender As Object, ByVal e As EventArgs)
    	' Fires when the application ends
	End Sub
	
End Class
